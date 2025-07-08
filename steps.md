Build a Python-based smart office surveillance system that performs the following:

1. **Facial Recognition & Attendance:**
   - Use webcam (for now) to detect and recognize faces in real time.
   - Load a pre-defined database of employee face encodings.
   - On successful match, log employee name with current timestamp as their entry time.
   - Maintain a CSV or database record of daily attendance (entry, exit, work duration).

2. **Unknown Person Alert:**
   - If a face is not found in the database, trigger a console alert (or later via email/SMS).
   - Start tracking the unknown individual via face ID.

3. **Movement Tracking:**
   - Define zones (e.g., Front Desk, Break Area, Exit Door) in the video feed manually.
   - Track employee presence in each zone and log duration spent.

4. **Daily Log Output:**
   - Generate a report showing:
     - Employees present
     - Entry/Exit times
     - Time spent in different zones
     - Alerts (if any unknown persons were detected)

Use OpenCV + face_recognition + any database (e.g., SQLite or CSV for simplicity). Organize logic into modular files: `face_recognition.py`, `attendance_logger.py`, `movement_tracker.py`, `alert_system.py`.
