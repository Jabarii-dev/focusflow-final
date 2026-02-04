import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  Moon, 
  Laptop, 
  Zap,
  Upload,
  Link as LinkIcon
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { useState, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { useTheme } from "next-themes"
import { useCompactMode } from "@/hooks/use-compact-mode"
import { useAction } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useI18n } from "@/hooks/use-i18n"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuthActions } from "@convex-dev/auth/react"

export default function SettingsPage() {
  const { name, email, bio, avatarUrl, updateProfile } = useProfile()
  const { t } = useI18n()
  const [formData, setFormData] = useState({ name: "", email: "", bio: "", avatarUrl: "" })
  const { setTheme, resolvedTheme } = useTheme()
  const { isCompact, toggleCompactMode } = useCompactMode()
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const updatePassword = useAction(api.authHelpers.updatePassword)
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const { signOut } = useAuthActions()
  const deleteAccount = useAction(api.authHelpers.deleteAccount)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await deleteAccount()
      await signOut()
      toast.success("Account deleted successfully")
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Failed to delete account")
      setIsDeleting(false)
    }
  }

  // Focus Mode State
  const [focusSettings, setFocusSettings] = useState({
    strictMode: true,
    blockDistractionPrompts: false,
    defaultSessionMinutes: 45
  })

  useEffect(() => {
    setMounted(true)
    // Load focus settings from localStorage
    const savedSettings = localStorage.getItem("focusflow.focusMode")
    if (savedSettings) {
      try {
        setFocusSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse focus settings", e)
      }
    }
  }, [])

  useEffect(() => {
    setFormData({ name, email, bio, avatarUrl: avatarUrl || "" })
  }, [name, email, bio, avatarUrl])

  const handleSave = () => {
    updateProfile(formData.name, formData.email, formData.bio, formData.avatarUrl)
    toast.success(t('profileUpdated'))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 800 * 1024) {
        toast.error(t('fileSizeError'))
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSaveFocusSettings = () => {
    localStorage.setItem("focusflow.focusMode", JSON.stringify(focusSettings))
    toast.success(t('focusPrefsSaved'))
  }

  const handleUpdatePassword = async () => {
    if (!passwordData.new) {
      toast.error(t('enterNewPassword'))
      return
    }
    if (passwordData.new !== passwordData.confirm) {
      toast.error(t('passwordsDoNotMatch'))
      return
    }
    if (passwordData.new.length < 8) {
      toast.error(t('passwordTooShort'))
      return
    }

    setIsUpdatingPassword(true)
    try {
      await updatePassword({ newPassword: passwordData.new })
      toast.success(t('passwordUpdated'))
      setPasswordData({ current: "", new: "", confirm: "" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('passwordUpdateFailed'))
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('settings')}</h1>
          <p className="mt-1 text-muted-foreground">{t('manageAccount')}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] lg:grid-cols-4">
            <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
            <TabsTrigger value="focus">{t('focusMode')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('privacy')}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profileInfo')}</CardTitle>
                <CardDescription>{t('updatePhoto')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24 border-2 border-border">
                      <AvatarImage src={formData.avatarUrl || "https://github.com/shadcn.png"} alt={name} className="object-cover" />
                      <AvatarFallback className="text-xl">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={triggerFileInput} className="gap-2">
                        <Upload className="h-3.5 w-3.5" />
                        {t('upload')}
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center max-w-[150px]">
                      {t('fileFormatError')}
                    </p>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="avatar-url">{t('avatarUrl')}</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="avatar-url" 
                          placeholder="https://example.com/avatar.png" 
                          className="pl-9"
                          value={formData.avatarUrl}
                          onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('name')}</Label>
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input 
                          id="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t('bio')}</Label>
                      <Input 
                        id="bio" 
                        value={formData.bio} 
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                        placeholder="Product Designer & Developer"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSave}>{t('save')}</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('appearance')}</CardTitle>
                <CardDescription>{t('customizeLook')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <Label className="text-base">{t('darkMode')}</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('reduceEyeStrain')}</p>
                  </div>
                  <Switch 
                    checked={mounted && resolvedTheme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      <Label className="text-base">{t('compactMode')}</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('reduceSpacing')}</p>
                  </div>
                  <Switch 
                    checked={isCompact}
                    onCheckedChange={toggleCompactMode}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('notifications')}</CardTitle>
                <CardDescription>{t('configureAlerts')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('emailNotifDesc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('pushNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('pushNotifDesc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="focus" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <CardTitle>{t('focusConfiguration')}</CardTitle>
                </div>
                <CardDescription>{t('focusConfigDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">{t('strictMode')}</Label>
                      <p className="text-sm text-muted-foreground">{t('strictModeDesc')}</p>
                    </div>
                    <Switch 
                      checked={focusSettings.strictMode}
                      onCheckedChange={(checked) => setFocusSettings(prev => ({ ...prev, strictMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">{t('blockDistractions')}</Label>
                      <p className="text-sm text-muted-foreground">{t('blockDistractionsDesc')}</p>
                    </div>
                    <Switch 
                      checked={focusSettings.blockDistractionPrompts}
                      onCheckedChange={(checked) => setFocusSettings(prev => ({ ...prev, blockDistractionPrompts: checked }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>{t('defaultFocusDuration')}</Label>
                  <div className="flex items-center gap-4">
                    {[25, 45, 60, 90].map((duration) => (
                      <Button 
                        key={duration}
                        variant={focusSettings.defaultSessionMinutes === duration ? "default" : "outline"} 
                        className="w-20"
                        onClick={() => setFocusSettings(prev => ({ ...prev, defaultSessionMinutes: duration }))}
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleSaveFocusSettings}>{t('save')}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('security')}</CardTitle>
                <CardDescription>{t('securityDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">{t('currentPassword')}</Label>
                  <Input 
                    id="current" 
                    type="password" 
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">{t('newPassword')}</Label>
                  <Input 
                    id="new" 
                    type="password" 
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">{t('confirmPassword')}</Label>
                  <Input 
                    id="confirm" 
                    type="password" 
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? "Updating..." : t('updatePassword')}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">{t('dangerZone')}</CardTitle>
                <CardDescription>{t('irreversibleActions')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t('deleteAccount')}</Label>
                    <p className="text-sm text-muted-foreground">{t('deleteAccountDesc')}</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : t('deleteAccount')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteAccount')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('deleteAccountDesc')}
                          <br /><br />
                          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={(e) => {
                            e.preventDefault()
                            handleDeleteAccount()
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : t('delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
