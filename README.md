# Mini SOC Lab - Vulnerable Environment & Monitoring Stack

## Overview
This project demonstrates a comprehensive Security Operations Center (SOC) environment built entirely with Docker. It simulates a real-world scenario by combining intentionally vulnerable web applications with industry-standard security monitoring and defense tools. 

The goal of this project is to provide a practical lab for:
- Understanding common web attack vectors (SQLi, XSS, etc.).
- configuring and tuning Web Application Firewalls (ModSecurity).
- Analyzing network traffic and security logs.
- Building dashboards and alerts in SIEM platforms (ELK & Splunk).

## Architecture

The environment consists of two main zones: **Targets** and **Defense/Monitoring**.

### 🎯 Vulnerable Targets
*   **DVWA (Damn Vulnerable Web App)**: A PHP/MySQL web application widely used by security professionals to test their skills and tools in a legal environment. Build locally to ensure full control over the source code.
*   **Vulnerable WordPress (DVWP)**: An instance of WordPress (v4.9.8) specifically chosen for its known vulnerabilities, allowing for the simulation of CMS-specific attacks and exploit chains.

### 🛡️ Security & Monitoring Stack
*   **WAF (Web Application Firewall)**: Nginx configured with **ModSecurity 3** and the **OWASP Core Rule Set (CRS)**. It acts as a reverse proxy, intercepting malicious traffic before it reaches the DVWA target.
*   **IDS (Intrusion Detection System)**: **Suricata** configured to monitor network traffic for malicious signatures and anomalies.
*   **SIEM (Security Information and Event Management)**:
    *   **ELK Stack**: A complete pipeline using **Elasticsearch** (Storage), **Logstash** (Processing), and **Kibana** (Visualization). 
    *   **Filebeat**: Lightweight shippers used to forward logs from ModSecurity and Suricata to the ELK pipeline.
    *   **Splunk**: An enterprise-grade SIEM instance integrated for comparative analysis and advanced threat hunting exercises.

## 🚀 Getting Started

### Prerequisites
*   Docker
*   Docker Compose

### Installation
1.  Clone the repository.
2.  Start the environment:
    ```bash
    docker compose up -d
    ```
    *Note: The first startup may take a few minutes as images are pulled and the ELK/Splunk stacks initialize.*

3.  **Access the Services**:
    *   **DVWA (via WAF)**: `http://localhost:8080`
    *   **WordPress**: `http://localhost:31337`
    *   **Kibana Dashboard**: `http://localhost:5601`
    *   **Splunk Dashboard**: `http://localhost:8000`

## 👏 Credits & Acknowledgements

This project integrates several outstanding open-source projects:

*   **DVWA**: Created by [Ryan Dewhurst (RandomStorm)](https://github.com/digininja) and the DVWA team. It remains the standard for web application security training.
*   **DVWP**: The concept of "Damn Vulnerable WordPress" has been pioneered by various researchers (e.g., [vavkamil](https://github.com/vavkamil), [WPScan Team](https://wpscan.com/)). This project serves as a containerized implementation of those concepts using verified vulnerable versions.
*   **ModSecurity & OWASP CRS**: The backbone of open-source web application firewalling.

## ⚠️ Disclaimer
**SECURITY WARNING**: This project contains applications that are **intentionally vulnerable**.
*   **DO NOT** run this on a public server or an untrusted network.
*   **DO NOT** expose these ports to the internet.
*   Use only for educational purposes and in an isolated environment.
