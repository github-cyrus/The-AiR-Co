-- Seed sample data for TheAirCo system

-- Insert sample employees
INSERT INTO employees (id, name, email, employee_id, department, position, face_encoding, avatar_url, status, join_date) VALUES
('emp_001', 'John Doe', 'john.doe@company.com', 'EMP001', 'Engineering', 'Senior Developer', 'face_encoding_john', '/placeholder.svg?height=40&width=40', 'active', '2023-01-15'),
('emp_002', 'Jane Smith', 'jane.smith@company.com', 'EMP002', 'Marketing', 'Marketing Manager', 'face_encoding_jane', '/placeholder.svg?height=40&width=40', 'active', '2023-02-20'),
('emp_003', 'Mike Johnson', 'mike.johnson@company.com', 'EMP003', 'Sales', 'Sales Representative', 'face_encoding_mike', '/placeholder.svg?height=40&width=40', 'active', '2023-03-10'),
('emp_004', 'Sarah Wilson', 'sarah.wilson@company.com', 'EMP004', 'HR', 'HR Manager', 'face_encoding_sarah', '/placeholder.svg?height=40&width=40', 'active', '2023-04-05'),
('emp_005', 'David Brown', 'david.brown@company.com', 'EMP005', 'Engineering', 'Junior Developer', 'face_encoding_david', '/placeholder.svg?height=40&width=40', 'active', '2023-05-12'),
('emp_006', 'Emily Davis', 'emily.davis@company.com', 'EMP006', 'Design', 'UI/UX Designer', 'face_encoding_emily', '/placeholder.svg?height=40&width=40', 'active', '2023-06-18'),
('emp_007', 'Robert Taylor', 'robert.taylor@company.com', 'EMP007', 'Finance', 'Financial Analyst', 'face_encoding_robert', '/placeholder.svg?height=40&width=40', 'active', '2023-07-22'),
('emp_008', 'Lisa Anderson', 'lisa.anderson@company.com', 'EMP008', 'Marketing', 'Content Creator', 'face_encoding_lisa', '/placeholder.svg?height=40&width=40', 'active', '2023-08-14');

-- Insert sample attendance records for the current week
INSERT INTO attendance_records (id, employee_id, date, check_in, check_out, total_hours, status, location) VALUES
-- Monday
('att_001', 'emp_001', '2024-01-01', '09:00:00', '17:30:00', 8.5, 'present', 'Main Entrance'),
('att_002', 'emp_002', '2024-01-01', '08:45:00', '17:15:00', 8.5, 'present', 'Main Entrance'),
('att_003', 'emp_003', '2024-01-01', '09:15:00', '17:45:00', 8.5, 'late', 'Main Entrance'),
('att_004', 'emp_004', '2024-01-01', '09:00:00', '17:00:00', 8.0, 'present', 'Main Entrance'),
('att_005', 'emp_005', '2024-01-01', '08:30:00', '17:30:00', 9.0, 'present', 'Main Entrance'),

-- Tuesday
('att_006', 'emp_001', '2024-01-02', '09:00:00', '17:30:00', 8.5, 'present', 'Main Entrance'),
('att_007', 'emp_002', '2024-01-02', '08:45:00', '17:15:00', 8.5, 'present', 'Main Entrance'),
('att_008', 'emp_003', '2024-01-02', '09:00:00', '17:30:00', 8.5, 'present', 'Main Entrance'),
('att_009', 'emp_004', '2024-01-02', '09:00:00', '16:00:00', 7.0, 'early_leave', 'Main Entrance'),
('att_010', 'emp_005', '2024-01-02', '08:30:00', '17:30:00', 9.0, 'present', 'Main Entrance'),

-- Wednesday
('att_011', 'emp_001', '2024-01-03', '09:00:00', '17:30:00', 8.5, 'present', 'Main Entrance'),
('att_012', 'emp_002', '2024-01-03', '08:45:00', '17:15:00', 8.5, 'present', 'Main Entrance'),
('att_013', 'emp_003', '2024-01-03', '09:20:00', '17:45:00', 8.4, 'late', 'Main Entrance'),
('att_014', 'emp_004', '2024-01-03', '09:00:00', '17:00:00', 8.0, 'present', 'Main Entrance'),
('att_015', 'emp_005', '2024-01-03', '08:30:00', '17:30:00', 9.0, 'present', 'Main Entrance'),

-- Thursday (current day)
('att_016', 'emp_001', '2024-01-04', '09:00:00', NULL, 0, 'present', 'Main Entrance'),
('att_017', 'emp_002', '2024-01-04', '08:45:00', NULL, 0, 'present', 'Main Entrance'),
('att_018', 'emp_003', '2024-01-04', '09:15:00', NULL, 0, 'late', 'Main Entrance'),
('att_019', 'emp_004', '2024-01-04', '09:00:00', NULL, 0, 'present', 'Main Entrance'),
('att_020', 'emp_005', '2024-01-04', '08:30:00', NULL, 0, 'present', 'Main Entrance');

-- Insert sample face detections
INSERT INTO face_detections (id, camera_id, employee_id, bounding_box, confidence, timestamp, location, is_recognized) VALUES
('det_001', 'cam_001', 'emp_001', '{"x": 100, "y": 50, "width": 80, "height": 100}', 0.985, '2024-01-04 09:00:00', 'Main Entrance', TRUE),
('det_002', 'cam_001', 'emp_002', '{"x": 200, "y": 80, "width": 75, "height": 95}', 0.978, '2024-01-04 08:45:00', 'Main Entrance', TRUE),
('det_003', 'cam_001', NULL, '{"x": 150, "y": 60, "width": 70, "height": 90}', 0.652, '2024-01-04 10:30:00', 'Main Entrance', FALSE),
('det_004', 'cam_002', 'emp_003', '{"x": 250, "y": 100, "width": 82, "height": 98}', 0.968, '2024-01-04 09:15:00', 'Office Floor', TRUE),
('det_005', 'cam_002', 'emp_004', '{"x": 300, "y": 120, "width": 78, "height": 92}', 0.955, '2024-01-04 09:00:00', 'Office Floor', TRUE);

-- Insert sample emotion detections
INSERT INTO emotion_detections (id, employee_id, primary_emotion, confidence, emotion_scores, timestamp, location) VALUES
('emo_001', 'emp_001', 'focused', 0.892, '{"happy": 0.12, "sad": 0.05, "angry": 0.02, "focused": 0.89, "stressed": 0.08, "neutral": 0.15}', '2024-01-04 10:00:00', 'Workstation Area'),
('emo_002', 'emp_002', 'happy', 0.845, '{"happy": 0.84, "sad": 0.03, "angry": 0.01, "focused": 0.65, "stressed": 0.02, "neutral": 0.12}', '2024-01-04 10:15:00', 'Meeting Room'),
('emo_003', 'emp_003', 'stressed', 0.756, '{"happy": 0.08, "sad": 0.15, "angry": 0.12, "focused": 0.35, "stressed": 0.76, "neutral": 0.18}', '2024-01-04 10:30:00', 'Workstation Area'),
('emo_004', 'emp_004', 'neutral', 0.689, '{"happy": 0.25, "sad": 0.08, "angry": 0.05, "focused": 0.45, "stressed": 0.12, "neutral": 0.69}', '2024-01-04 10:45:00', 'Office Floor'),
('emo_005', 'emp_005', 'tired', 0.723, '{"happy": 0.15, "sad": 0.25, "angry": 0.05, "focused": 0.28, "stressed": 0.18, "tired": 0.72, "neutral": 0.22}', '2024-01-04 11:00:00', 'Break Area');

-- Insert sample movement tracking
INSERT INTO movement_tracking (id, employee_id, zone, entry_time, exit_time, duration_minutes, date) VALUES
('mov_001', 'emp_001', 'zone_entrance', '2024-01-04 09:00:00', '2024-01-04 09:02:00', 2, '2024-01-04'),
('mov_002', 'emp_001', 'zone_workstation', '2024-01-04 09:02:00', '2024-01-04 12:00:00', 178, '2024-01-04'),
('mov_003', 'emp_001', 'zone_break', '2024-01-04 12:00:00', '2024-01-04 12:30:00', 30, '2024-01-04'),
('mov_004', 'emp_001', 'zone_workstation', '2024-01-04 12:30:00', '2024-01-04 15:00:00', 150, '2024-01-04'),
('mov_005', 'emp_001', 'zone_meeting', '2024-01-04 15:00:00', '2024-01-04 16:00:00', 60, '2024-01-04'),
('mov_006', 'emp_002', 'zone_entrance', '2024-01-04 08:45:00', '2024-01-04 08:47:00', 2, '2024-01-04'),
('mov_007', 'emp_002', 'zone_workstation', '2024-01-04 08:47:00', '2024-01-04 10:00:00', 73, '2024-01-04'),
('mov_008', 'emp_002', 'zone_meeting', '2024-01-04 10:00:00', '2024-01-04 11:30:00', 90, '2024-01-04'),
('mov_009', 'emp_002', 'zone_break', '2024-01-04 11:30:00', '2024-01-04 12:00:00', 30, '2024-01-04'),
('mov_010', 'emp_003', 'zone_entrance', '2024-01-04 09:15:00', '2024-01-04 09:17:00', 2, '2024-01-04');

-- Insert sample alerts
INSERT INTO alerts (id, type, severity, title, description, employee_id, location, acknowledged, created_at) VALUES
('alert_001', 'security', 'high', 'Unknown Person Detected', 'Unrecognized individual detected at main entrance', NULL, 'Main Entrance', FALSE, '2024-01-04 10:15:00'),
('alert_002', 'emotion', 'medium', 'Employee Stress Alert', 'Mike Johnson showing elevated stress levels', 'emp_003', 'Workstation Area', FALSE, '2024-01-04 09:45:00'),
('alert_003', 'attendance', 'low', 'Late Arrival', 'Sarah Wilson arrived 15 minutes late', 'emp_004', 'Main Entrance', TRUE, '2024-01-04 09:15:00'),
('alert_004', 'emergency', 'critical', 'Emergency Keyword Detected', 'Emergency keyword detected in meeting room audio', NULL, 'Meeting Room B', FALSE, '2024-01-04 08:30:00'),
('alert_005', 'system', 'low', 'Camera Maintenance', 'Camera 4 requires cleaning - image quality degraded', NULL, 'Parking Lot', FALSE, '2024-01-04 08:00:00');

-- Insert sample voice detections
INSERT INTO voice_detections (id, location, detection_type, keyword, confidence, timestamp, alert_triggered) VALUES
('voice_001', 'Meeting Room B', 'emergency', 'help', 0.892, '2024-01-04 08:30:00', TRUE),
('voice_002', 'Reception', 'command', 'show attendance', 0.756, '2024-01-04 09:00:00', FALSE),
('voice_003', 'Break Area', 'normal', NULL, 0.945, '2024-01-04 10:00:00', FALSE),
('voice_004', 'Meeting Room A', 'emergency', 'emergency', 0.823, '2024-01-04 11:15:00', TRUE),
('voice_005', 'Office Floor', 'command', 'display heatmap', 0.689, '2024-01-04 12:00:00', FALSE);
