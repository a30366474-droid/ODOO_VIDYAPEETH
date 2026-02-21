"use client";

import React from "react";
import { useTheme } from "@/context";
import { useLocalStorage } from "@/hooks";

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    maintenanceAlerts: boolean;
    tripUpdates: boolean;
    fuelAlerts: boolean;
  };
  display: {
    compactMode: boolean;
    showMileage: "km" | "miles";
    dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
    currency: "USD" | "EUR" | "GBP" | "INR";
  };
  privacy: {
    shareAnalytics: boolean;
    showOnlineStatus: boolean;
  };
}

const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    maintenanceAlerts: true,
    tripUpdates: true,
    fuelAlerts: true,
  },
  display: {
    compactMode: false,
    showMileage: "km",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  },
  privacy: {
    shareAnalytics: true,
    showOnlineStatus: true,
  },
};

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function SettingSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useLocalStorage<UserSettings>(
    "fleetflow_settings",
    defaultSettings
  );
  const [saved, setSaved] = React.useState(false);

  const updateNotification = (key: keyof UserSettings["notifications"], value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    });
  };

  const updateDisplay = <K extends keyof UserSettings["display"]>(
    key: K,
    value: UserSettings["display"][K]
  ) => {
    setSettings({
      ...settings,
      display: { ...settings.display, [key]: value },
    });
  };

  const updatePrivacy = (key: keyof UserSettings["privacy"], value: boolean) => {
    setSettings({
      ...settings,
      privacy: { ...settings.privacy, [key]: value },
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setTheme("light");
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences and application settings
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">A</span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Admin User</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">admin@fleetflow.io</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Role: Administrator</p>
          </div>
          <button className="ml-auto px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Choose light or dark mode</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  theme === "light"
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  theme === "dark"
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>
          <SettingToggle
            label="Compact Mode"
            description="Use smaller spacing and font sizes"
            checked={settings.display.compactMode}
            onChange={(v) => updateDisplay("compactMode", v)}
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Display Settings</h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <SettingSelect
            label="Distance Unit"
            value={settings.display.showMileage}
            options={[
              { value: "km", label: "Kilometers" },
              { value: "miles", label: "Miles" },
            ]}
            onChange={(v) => updateDisplay("showMileage", v)}
          />
          <SettingSelect
            label="Date Format"
            value={settings.display.dateFormat}
            options={[
              { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
              { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
              { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
            ]}
            onChange={(v) => updateDisplay("dateFormat", v)}
          />
          <SettingSelect
            label="Currency"
            value={settings.display.currency}
            options={[
              { value: "USD", label: "USD ($)" },
              { value: "EUR", label: "EUR (€)" },
              { value: "GBP", label: "GBP (£)" },
              { value: "INR", label: "INR (₹)" },
            ]}
            onChange={(v) => updateDisplay("currency", v)}
          />
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <SettingToggle
            label="Email Notifications"
            description="Receive updates via email"
            checked={settings.notifications.email}
            onChange={(v) => updateNotification("email", v)}
          />
          <SettingToggle
            label="Push Notifications"
            description="Receive browser push notifications"
            checked={settings.notifications.push}
            onChange={(v) => updateNotification("push", v)}
          />
          <SettingToggle
            label="SMS Notifications"
            description="Receive text message alerts"
            checked={settings.notifications.sms}
            onChange={(v) => updateNotification("sms", v)}
          />
          <SettingToggle
            label="Maintenance Alerts"
            description="Get notified about upcoming maintenance"
            checked={settings.notifications.maintenanceAlerts}
            onChange={(v) => updateNotification("maintenanceAlerts", v)}
          />
          <SettingToggle
            label="Trip Updates"
            description="Get notified about trip status changes"
            checked={settings.notifications.tripUpdates}
            onChange={(v) => updateNotification("tripUpdates", v)}
          />
          <SettingToggle
            label="Fuel Alerts"
            description="Get notified when fuel is low"
            checked={settings.notifications.fuelAlerts}
            onChange={(v) => updateNotification("fuelAlerts", v)}
          />
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Privacy</h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          <SettingToggle
            label="Share Analytics"
            description="Help improve FleetFlow by sharing usage data"
            checked={settings.privacy.shareAnalytics}
            onChange={(v) => updatePrivacy("shareAnalytics", v)}
          />
          <SettingToggle
            label="Show Online Status"
            description="Let others see when you're online"
            checked={settings.privacy.showOnlineStatus}
            onChange={(v) => updatePrivacy("showOnlineStatus", v)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Settings saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
