export class DeviceStatusModel {
    deviceId: string;
    isOn: boolean;
    alertCount: number;

    calculateDeviceTime(lastSeen: string) {
        const now = new Date();
        const lastSeenDate = new Date(lastSeen);
        const diff = Math.abs(now.getTime() - lastSeenDate.getTime());
        const diffMins = Math.ceil(diff / (1000 * 60));
        this.setIsOn(diffMins <= 5);
    }

    getIsOn(): boolean {
        return this.isOn;
    }

    getAlertCount(): number {
        return this.alertCount;
    }

    setIsOn(isOn) {
        this.isOn = isOn;
    }

    setAlertCount(alertCount) {
        this.alertCount = alertCount;
    }
}