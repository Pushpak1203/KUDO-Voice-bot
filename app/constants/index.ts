export enum RobotCommand {
    FORWARD = 'F',
    BACKWARD = 'B',
    LEFT = 'L',
    RIGHT = 'R',
    STOP = 'S'
}

export const VoiceKeywords = {
    FORWARD: ["forward", "go straight", "move up"],
    BACKWARD: ["backward", "go back", "reverse", "move back"],
    LEFT: ["left", "turn left", "go left"],
    RIGHT: ["right", "turn right", "go right"],
    STOP: ["stop", "halt", "freeze"]
};

export const AppRoutes = {
    SPLASH: "splash_screen",
    HOME: "home_dashboard",
    BLUETOOTH: "bluetooth_connection",
    VOICE_CONTROL: "voice_control",
    MANUAL_CONTROL: "manual_control_fixed",
    SETTINGS: "settings",
    HISTORY: "command_history",
    ROBOT_STATUS: "robot_status",
    OBSTACLE_ALERT: "obstacle_alert"
};

export const ErrorMessages = {
    BLUETOOTH_OFF: "Bluetooth is disabled. Please enable it in your device settings.",
    CONNECTION_LOST: "Connection to the robot was lost.",
    PERMISSION_DENIED: "Permission denied. Please grant the required permissions.",
    MIC_DENIED: "Microphone access denied. Voice control requires this permission.",
    ROBOT_NOT_CONNECTED: "Robot is not connected. Please pair first.",
    INVALID_VOICE_COMMAND: "Command not recognized. Please try again."
};
