// Maynd.ma Desktop - Rust Backend with Admin API integration
use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::Manager;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AppConfig {
    admin_api_url: String,
    license_key: Option<String>,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            admin_api_url: "http://localhost:4000/api".to_string(),
            license_key: None,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct HardwareInfo {
    os: String,
    arch: String,
    hostname: String,
    cpu: String,
    memory: u64,
    gpu: Option<String>,
}

#[tauri::command]
async fn get_hardware_info() -> Result<HardwareInfo, String> {
    let hostname = std::env::var("COMPUTERNAME")
        .or_else(|_| std::env::var("HOSTNAME"))
        .unwrap_or_else(|_| "unknown".to_string());
    
    let os = if cfg!(target_os = "windows") {
        "Windows".to_string()
    } else if cfg!(target_os = "macos") {
        "macOS".to_string()
    } else if cfg!(target_os = "linux") {
        "Linux".to_string()
    } else {
        "Unknown".to_string()
    };
    
    let arch = std::env::consts::ARCH.to_string();
    let cpu = "Unknown".to_string();
    let memory: u64 = 8192;
    let gpu: Option<String> = None;
    
    Ok(HardwareInfo { os, arch, hostname, cpu, memory, gpu })
}

#[tauri::command]
async fn validate_license(
    state: tauri::State<'_, std::sync::Arc<std::sync::Mutex<AppConfig>>>,
    license_key: Option<String>,
) -> Result<serde_json::Value, String> {
    let config = state.lock().unwrap();
    let admin_api_url = config.admin_api_url.clone();
    let key = license_key.or(config.license_key.clone()).ok_or("No license key provided")?;
    
    let client = reqwest::blocking::Client::new();
    let response = match client
        .post(&format!("{}/licenses/validate", admin_api_url))
        .json(&serde_json::json!({ "license_key": key }))
        .send()
    {
        Ok(resp) => resp.json::<serde_json::Value>().map_err(|e| e.to_string())?,
        Err(e) => return Err(format!("Failed to connect to admin API: {}", e)),
    };
    
    Ok(response)
}

#[tauri::command]
async fn set_admin_api_url(
    state: tauri::State<'_, std::sync::Arc<std::sync::Mutex<AppConfig>>>,
    url: String,
) {
    let mut config = state.lock().unwrap();
    config.admin_api_url = url;
}

#[tauri::command]
async fn set_license_key(
    state: tauri::State<'_, std::sync::Arc<std::sync::Mutex<AppConfig>>>,
    key: String,
) {
    let mut config = state.lock().unwrap();
    config.license_key = Some(key);
}

#[tauri::command]
async fn get_config(
    state: tauri::State<'_, std::sync::Arc<std::sync::Mutex<AppConfig>>>,
) -> AppConfig {
    state.lock().unwrap().clone()
}

fn main() {
    let config = std::sync::Arc::new(std::sync::Mutex::new(AppConfig::default()));
    
    tauri::Builder::default()
        .manage(config)
        .invoke_handler(tauri::generate_handler![
            get_hardware_info,
            validate_license,
            set_admin_api_url,
            set_license_key,
            get_config,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
