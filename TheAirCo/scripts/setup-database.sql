-- TheAirCo Database Setup
-- This script creates the necessary tables for the TheAirCo system

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    face_encoding TEXT,
    avatar_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create attendance records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    total_hours DECIMAL(4,2) DEFAULT 0,
    status ENUM('present', 'absent', 'late', 'early_leave') DEFAULT 'present',
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_date (employee_id, date)
);

-- Create face detections table
CREATE TABLE IF NOT EXISTS face_detections (
    id VARCHAR(50) PRIMARY KEY,
    camera_id VARCHAR(50) NOT NULL,
    employee_id VARCHAR(50),
    bounding_box JSON,
    confidence DECIMAL(5,3),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100),
    is_recognized BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_camera_timestamp (camera_id, timestamp),
    INDEX idx_employee_timestamp (employee_id, timestamp)
);

-- Create emotion detections table
CREATE TABLE IF NOT EXISTS emotion_detections (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50),
    primary_emotion VARCHAR(50),
    confidence DECIMAL(5,3),
    emotion_scores JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_employee_timestamp (employee_id, timestamp)
);

-- Create movement tracking table
CREATE TABLE IF NOT EXISTS movement_tracking (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50),
    zone VARCHAR(100),
    entry_time TIMESTAMP,
    exit_time TIMESTAMP,
    duration_minutes INT,
    date DATE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_employee_date (employee_id, date),
    INDEX idx_zone_date (zone, date)
);

-- Create zones table
CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    coordinates JSON,
    zone_type VARCHAR(50),
    max_occupancy INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('security', 'attendance', 'emotion', 'emergency', 'system') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    employee_id VARCHAR(50),
    location VARCHAR(100),
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(50),
    acknowledged_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_type_severity (type, severity),
    INDEX idx_acknowledged_created (acknowledged, created_at)
);

-- Create cameras table
CREATE TABLE IF NOT EXISTS cameras (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    ip_address VARCHAR(45),
    status ENUM('online', 'offline', 'maintenance') DEFAULT 'online',
    coordinates JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create voice detections table
CREATE TABLE IF NOT EXISTS voice_detections (
    id VARCHAR(50) PRIMARY KEY,
    location VARCHAR(100),
    detection_type ENUM('emergency', 'command', 'normal') DEFAULT 'normal',
    keyword VARCHAR(100),
    confidence DECIMAL(5,3),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    alert_triggered BOOLEAN DEFAULT FALSE,
    INDEX idx_type_timestamp (detection_type, timestamp)
);

-- Insert default zones
INSERT INTO zones (id, name, coordinates, zone_type, max_occupancy) VALUES
('zone_entrance', 'Main Entrance', '{"x": 50, "y": 50, "width": 100, "height": 80}', 'entrance', 10),
('zone_workstation', 'Workstation Area', '{"x": 200, "y": 100, "width": 300, "height": 200}', 'work', 50),
('zone_meeting', 'Meeting Rooms', '{"x": 550, "y": 100, "width": 150, "height": 120}', 'meeting', 20),
('zone_break', 'Break Area', '{"x": 200, "y": 350, "width": 200, "height": 100}', 'break', 15),
('zone_restroom', 'Restroom', '{"x": 450, "y": 350, "width": 80, "height": 80}', 'restroom', 5);

-- Insert default cameras
INSERT INTO cameras (id, name, location, ip_address, status, coordinates) VALUES
('cam_001', 'Main Entrance', 'Ground Floor', '192.168.1.101', 'online', '{"x": 75, "y": 75}'),
('cam_002', 'Office Floor', 'Second Floor', '192.168.1.102', 'online', '{"x": 350, "y": 200}'),
('cam_003', 'Break Room', 'Second Floor', '192.168.1.103', 'online', '{"x": 300, "y": 400}'),
('cam_004', 'Parking Lot', 'Outside', '192.168.1.104', 'offline', '{"x": 100, "y": 500}'),
('cam_005', 'Meeting Room A', 'Second Floor', '192.168.1.105', 'online', '{"x": 600, "y": 150}'),
('cam_006', 'Meeting Room B', 'Second Floor', '192.168.1.106', 'online', '{"x": 650, "y": 150}'),
('cam_007', 'Reception', 'Ground Floor', '192.168.1.107', 'online', '{"x": 150, "y": 100}'),
('cam_008', 'Server Room', 'Basement', '192.168.1.108', 'online', '{"x": 400, "y": 300}');
