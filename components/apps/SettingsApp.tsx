'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings, 
  Monitor, 
  Palette, 
  Volume2, 
  Bell, 
  Shield, 
  User, 
  Info,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Check,
  AlertTriangle,
  Moon,
  Sun,
  Laptop
} from 'lucide-react'
import { useTheme } from 'next-themes'

interface SettingsData {
  // Appearance
  theme: 'light' | 'dark' | 'system'
  accentColor: string
  fontSize: number
  windowTransparency: number
  animationsEnabled: boolean
  
  // Audio
  masterVolume: number
  notificationSounds: boolean
  systemSounds: boolean
  
  // Notifications
  showNotifications: boolean
  notificationPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  autoHideNotifications: boolean
  notificationDuration: number
  
  // Privacy & Security
  autoSave: boolean
  dataCollection: boolean
  errorReporting: boolean
  
  // System
  startupApps: string[]
  autoUpdate: boolean
  language: string
  timezone: string
  
  // User Profile
  username: string
  email: string
  avatar: string
}

const defaultSettings: SettingsData = {
  theme: 'system',
  accentColor: '#3b82f6',
  fontSize: 14,
  windowTransparency: 95,
  animationsEnabled: true,
  masterVolume: 75,
  notificationSounds: true,
  systemSounds: true,
  showNotifications: true,
  notificationPosition: 'top-right',
  autoHideNotifications: true,
  notificationDuration: 5,
  autoSave: true,
  dataCollection: false,
  errorReporting: true,
  startupApps: [],
  autoUpdate: true,
  language: 'en',
  timezone: 'UTC',
  username: 'User',
  email: '',
  avatar: ''
}

interface SettingsAppProps {
  onClose?: () => void
}

export default function SettingsApp({ onClose }: SettingsAppProps) {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('appearance')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const { theme, setTheme } = useTheme()

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mbx-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  // Update settings and mark as changed
  const updateSetting = <K extends keyof SettingsData>(
    key: K, 
    value: SettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  // Save settings to localStorage
  const saveSettings = async () => {
    setSaveStatus('saving')
    try {
      localStorage.setItem('mbx-settings', JSON.stringify(settings))
      
      // Apply theme change immediately
      if (settings.theme !== theme) {
        setTheme(settings.theme)
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSaveStatus('saved')
      setHasUnsavedChanges(false)
      
      // Clear saved status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setSaveStatus('error')
    }
  }

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings)
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  // Export settings
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `mbx-settings-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import settings
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setSettings({ ...defaultSettings, ...imported })
        setHasUnsavedChanges(true)
        setSaveStatus('idle')
      } catch (error) {
        console.error('Failed to import settings:', error)
        setSaveStatus('error')
      }
    }
    reader.readAsText(file)
  }

  const availableApps = [
    'File Browser', 'Markdown Editor', 'Calculator', 'Changelog', 'Settings'
  ]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Customize your Mbx OS experience
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="text-orange-600">
              Unsaved changes
            </Badge>
          )}
          
          {saveStatus === 'saved' && (
            <Badge variant="outline" className="text-green-600">
              <Check className="h-3 w-3 mr-1" />
              Saved
            </Badge>
          )}
          
          {saveStatus === 'error' && (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          )}
          
          <Button 
            onClick={saveSettings} 
            disabled={!hasUnsavedChanges || saveStatus === 'saving'}
            size="sm"
          >
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Audio</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance & Theme
                </CardTitle>
                <CardDescription>
                  Customize the visual appearance of your desktop
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => 
                      updateSetting('theme', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Laptop className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
                      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
                    ].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          settings.accentColor === color 
                            ? 'border-foreground scale-110' 
                            : 'border-border'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSetting('accentColor', color)}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <Label>Font Size: {settings.fontSize}px</Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) => updateSetting('fontSize', value[0])}
                    min={12}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Window Transparency */}
                <div className="space-y-2">
                  <Label>Window Transparency: {settings.windowTransparency}%</Label>
                  <Slider
                    value={[settings.windowTransparency]}
                    onValueChange={(value) => updateSetting('windowTransparency', value[0])}
                    min={70}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Animations */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth transitions and animations
                    </p>
                  </div>
                  <Switch
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Settings */}
          <TabsContent value="audio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Audio & Sound
                </CardTitle>
                <CardDescription>
                  Control system audio and notification sounds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Master Volume */}
                <div className="space-y-2">
                  <Label>Master Volume: {settings.masterVolume}%</Label>
                  <Slider
                    value={[settings.masterVolume]}
                    onValueChange={(value) => updateSetting('masterVolume', value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <Separator />

                {/* Sound Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notification Sounds</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for notifications and alerts
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationSounds}
                      onCheckedChange={(checked) => updateSetting('notificationSounds', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Sounds</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for system events and actions
                      </p>
                    </div>
                    <Switch
                      checked={settings.systemSounds}
                      onCheckedChange={(checked) => updateSetting('systemSounds', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Show Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow apps to show notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.showNotifications}
                    onCheckedChange={(checked) => updateSetting('showNotifications', checked)}
                  />
                </div>

                {settings.showNotifications && (
                  <>
                    <Separator />
                    
                    {/* Notification Position */}
                    <div className="space-y-2">
                      <Label>Notification Position</Label>
                      <Select
                        value={settings.notificationPosition}
                        onValueChange={(value: any) => updateSetting('notificationPosition', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Auto-hide */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-hide Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically hide notifications after a delay
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoHideNotifications}
                        onCheckedChange={(checked) => updateSetting('autoHideNotifications', checked)}
                      />
                    </div>

                    {/* Duration */}
                    {settings.autoHideNotifications && (
                      <div className="space-y-2">
                        <Label>Auto-hide Duration: {settings.notificationDuration}s</Label>
                        <Slider
                          value={[settings.notificationDuration]}
                          onValueChange={(value) => updateSetting('notificationDuration', value[0])}
                          min={3}
                          max={15}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control data collection and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Files</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save your work to prevent data loss
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Anonymous Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve Mbx OS by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => updateSetting('dataCollection', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Error Reporting</Label>
                    <p className="text-sm text-muted-foreground">
                      Send error reports to help fix bugs and improve stability
                    </p>
                  </div>
                  <Switch
                    checked={settings.errorReporting}
                    onCheckedChange={(checked) => updateSetting('errorReporting', checked)}
                  />
                </div>

                <Separator />

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    All data is stored locally in your browser. No personal information 
                    is transmitted to external servers without your explicit consent.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  System & Updates
                </CardTitle>
                <CardDescription>
                  System preferences and application management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Startup Apps */}
                <div className="space-y-2">
                  <Label>Startup Applications</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose which apps to open automatically when Mbx OS starts
                  </p>
                  <div className="space-y-2">
                    {availableApps.map((app) => (
                      <div key={app} className="flex items-center justify-between">
                        <Label>{app}</Label>
                        <Switch
                          checked={settings.startupApps.includes(app)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateSetting('startupApps', [...settings.startupApps, app])
                            } else {
                              updateSetting('startupApps', settings.startupApps.filter(a => a !== app))
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Auto Update */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically check for and install updates
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoUpdate}
                    onCheckedChange={(checked) => updateSetting('autoUpdate', checked)}
                  />
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => updateSetting('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Profile
                </CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => updateSetting('username', e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <Separator />

                {/* Data Management */}
                <div className="space-y-4">
                  <h3 className="font-medium">Data Management</h3>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      onClick={exportSettings}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export Settings
                    </Button>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSettings}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button variant="outline" className="flex items-center gap-2 w-full">
                        <Upload className="h-4 w-4" />
                        Import Settings
                      </Button>
                    </div>
                    
                    <Button 
                      variant="destructive" 
                      onClick={resetSettings}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Reset to Defaults
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Mbx OS Settings v0.2.0
          </div>
          <div className="flex items-center gap-4">
            <span>Current Theme: {settings.theme}</span>
            <span>Last Saved: {saveStatus === 'saved' ? 'Just now' : 'Not saved'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
