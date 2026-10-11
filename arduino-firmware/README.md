# Flashing the Arduino firmware
1. Install Arduino IDE 2.x and select **Arduino Uno** under Tools → Board.
2. Install the `Servo` library from Library Manager if it is not already available.
3. Open `robot_firmware.ino`, choose the correct serial port, and upload.
4. Keep the wheels off the ground for the first test. Open Serial Monitor at 9600 baud.
5. Pair the HC-05 from Android Bluetooth settings. Default PIN is often `1234` or `0000`.
6. Check telemetry and command response before placing the robot on the floor.

The firmware uses D5/D6 PWM enables, D7-D10 motor direction pins, D11/D12 ultrasonic echo/trigger, D3 servo, and D2/D4 SoftwareSerial for Bluetooth. Check your exact L298N module labels and motor polarity. Some modules require removing ENA/ENB jumpers to use PWM.
