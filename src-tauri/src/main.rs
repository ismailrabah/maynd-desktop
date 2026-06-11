use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct HardwareInfo {
    os: String,
    cpu: String,
    gpu: Option<String>,
    memory: u64,
    hostname: String,
    fingerprint: String,
}

#[tauri::command]
fn get_hardware_info() -> Result<HardwareInfo, String> {
    use sysinfo::System;
    let mut system = System::new_all();
    system.refresh_all();
    Ok(HardwareInfo {
        os: std::env::consts::OS.to_string(),
        cpu: system.cpus()[0].brand().to_string(),
        gpu: None,
        memory: system.total_memory(),
        hostname: hostname::get().map_or("unknown".to_string(), |h| h.to_string_lossy().into_owned()),
        fingerprint: "placeholder".to_string()
    })
}

#[tauri::command]
fn start_ai_engine(config: serde_json::Value) -> Result<bool, String> {
    Ok(true)
}

#[tauri::command]
fn stop_ai_engine() -> Result<bool, String> {
    Ok(true)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sysinfo::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            get_hardware_info,
            start_ai_engine,
            stop_ai_engine
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}