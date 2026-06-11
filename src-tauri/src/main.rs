use serde::{Deserialize, Serialize};
use std::process::Command;
use std::path::PathBuf;
use std::net::{TcpStream, TcpListener};
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
pub struct HardwareInfo {
    pub os: String,
    pub cpu: String,
    pub gpu: Option<String>,
    pub memory_total: u64,
    pub memory_used: u64,
    pub hostname: String,
    pub fingerprint: String,
    pub cores: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AIConfig {
    pub server_path: String,
    pub model_path: String,
    pub host: String,
    pub port: u16,
    pub context_length: u32,
    pub threads: u32,
    pub temperature: f32,
    pub top_p: f32,
    pub top_k: u32,
    pub repeat_penalty: f32,
    pub batch_size: u32,
    pub gpu_layers: Option<u32>,
}

fn generate_fingerprint() -> String {
    use sha2::{Sha256, Digest};
    let mut hasher = Sha256::new();
    hasher.update(std::env::consts::OS.as_bytes());
    hasher.update(std::env::consts::ARCH.as_bytes());
    if let Ok(hostname) = hostname::get() {
        hasher.update(hostname.to_string_lossy().as_bytes());
    }
    if let Ok(cpu) = sysinfo::Cpu::new() {
        for cpu in cpu.cpus() {
            hasher.update(cpu.brand().as_bytes());
        }
        hasher.update(cpu.num_cpus().to_string().as_bytes());
    }
    if let Ok(mem) = sysinfo::System::new().total_memory() {
        hasher.update(mem.to_string().as_bytes());
    }
    format!("{:x}", hasher.finalize())
}

fn detect_gpu() -> Option<String> {
    if Command::new("nvidia-smi").output().is_ok() {
        return Some("NVIDIA CUDA".to_string());
    }
    if Command::new("amd-smi").output().is_ok() {
        return Some("AMD ROCm".to_string());
    }
    if Command::new("intel_gpu_top").output().is_ok() {
        return Some("Intel GPU".to_string());
    }
    #[cfg(target_os = "linux")]
    {
        if let Ok(output) = Command::new("lspci").output() {
            let output_str = String::from_utf8_lossy(&output.stdout);
            if output_str.contains("NVIDIA") { return Some("NVIDIA".to_string()); }
            if output_str.contains("AMD") || output_str.contains("ATI") { return Some("AMD".to_string()); }
            if output_str.contains("Intel") { return Some("Intel".to_string()); }
        }
    }
    #[cfg(target_os = "macos")]
    {
        if Command::new("system_profiler").arg("SPDisplaysDataType").output().is_ok() {
            return Some("Apple Metal".to_string());
        }
    }
    None
}

fn is_port_in_use(port: u16) -> bool {
    match TcpListener::bind(format!("127.0.0.1:{}", port)) {
        Ok(_) => false,
        Err(_) => true,
    }
}

#[tauri::command]
fn get_hardware_info() -> Result<HardwareInfo, String> {
    let mut system = sysinfo::System::new_all();
    system.refresh_all();
    let os = std::env::consts::OS.to_string();
    let hostname = hostname::get().map_or("unknown".to_string(), |h| h.to_string_lossy().into_owned());
    let cpu_info = if let Ok(cpu) = sysinfo::Cpu::new() { cpu.cpus()[0].brand().to_string() } else { "Unknown".to_string() };
    let cores = system.cpus().len();
    let memory_total = system.total_memory();
    let memory_used = system.used_memory();
    let gpu = detect_gpu();
    let fingerprint = generate_fingerprint();
    Ok(HardwareInfo { os, cpu: cpu_info, gpu, memory_total, memory_used, hostname, fingerprint, cores })
}

#[tauri::command]
fn get_hardware_fingerprint() -> Result<String, String> {
    Ok(generate_fingerprint())
}

#[tauri::command]
fn check_gpu_available() -> Result<bool, String> {
    Ok(detect_gpu().is_some())
}

#[tauri::command]
fn start_ai_engine(config: AIConfig) -> Result<bool, String> {
    let server_path = PathBuf::from(&config.server_path);
    let model_path = PathBuf::from(&config.model_path);
    if !server_path.exists() { return Err(format!("Server not found: {}", config.server_path)); }
    if !model_path.exists() { return Err(format!("Model not found: {}", config.model_path)); }
    if is_port_in_use(config.port) { return Err(format!("Port {} in use", config.port)); }
    let mut cmd = Command::new(&server_path);
    cmd.arg("-m").arg(&model_path);
    cmd.arg("--host").arg(&config.host);
    cmd.arg("--port").arg(config.port.to_string());
    cmd.arg("--n_ctx").arg(config.context_length.to_string());
    cmd.arg("--n_threads").arg(config.threads.to_string());
    cmd.arg("--temperature").arg(config.temperature.to_string());
    cmd.arg("--top_p").arg(config.top_p.to_string());
    cmd.arg("--top_k").arg(config.top_k.to_string());
    cmd.arg("--repeat_penalty").arg(config.repeat_penalty.to_string());
    cmd.arg("--n_batch").arg(config.batch_size.to_string());
    if let Some(layers) = config.gpu_layers { if layers > 0 { cmd.arg("--n_gpu_layers").arg(layers.to_string()); } }
    match cmd.spawn() {
        Ok(_) => {
            std::thread::sleep(Duration::from_secs(2));
            Ok(is_port_in_use(config.port))
        }
        Err(e) => Err(format!("Failed to start: {}", e)),
    }
}

#[tauri::command]
fn stop_ai_engine() -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        let _ = Command::new("taskkill").arg("/F").arg("/IM").arg("llama-server.exe").output();
        let _ = Command::new("taskkill").arg("/F").arg("/IM").arg("llama-cli.exe").output();
    }
    #[cfg(not(target_os = "windows"))]
    {
        let _ = Command::new("pkill").arg("-f").arg("llama-server").output();
        let _ = Command::new("pkill").arg("-f").arg("llama-cli").output();
    }
    std::thread::sleep(Duration::from_secs(1));
    Ok(true)
}

#[tauri::command]
fn check_ai_server(host: String, port: u16) -> Result<bool, String> {
    match TcpStream::connect_timeout(&format!("{}:{}", host, port).parse().unwrap(), Duration::from_secs(1)) {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
fn list_models(models_dir: String) -> Result<Vec<String>, String> {
    use std::fs;
    let path = PathBuf::from(models_dir);
    if !path.exists() { return Ok(Vec::new()); }
    let mut models = Vec::new();
    if let Ok(entries) = fs::read_dir(&path) {
        for entry in entries {
            if let Ok(entry) = entry {
                if let Some(name) = entry.path().file_name() {
                    if let Some(name_str) = name.to_str() {
                        if name_str.ends_with(".gguf") { models.push(name_str.to_string()); }
                    }
                }
            }
        }
    }
    Ok(models)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sysinfo::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_hardware_info,
            get_hardware_fingerprint,
            check_gpu_available,
            start_ai_engine,
            stop_ai_engine,
            check_ai_server,
            list_models
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}