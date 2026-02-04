import { 
  Globe, 
  Search, 
  HelpCircle,
  Keyboard,
  MessageSquare,
  LogOut,
  MoreHorizontal,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "react-hot-toast"
import { useAuthActions } from "@convex-dev/auth/react"
import { useProfile } from "@/hooks/use-profile"
import { useI18n } from "@/hooks/use-i18n"
import { languageOptions } from "@/lib/i18n"

export function Navbar() {
  const { signOut } = useAuthActions()
  const { name, avatarUrl, language, setLanguage } = useProfile()
  const { t } = useI18n()

  const firstName = name.split(' ')[0]

  const handleSignOut = async () => {
    await signOut()
    toast.success(t('signedOut'))
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    const langLabel = languageOptions.find(l => l.code === lang)?.label || lang
    toast.success(`${t('languageChanged')} ${langLabel}`)
  }

  return (
    <header className="flex h-[56px] items-center justify-between border-b bg-background px-4 sticky top-0 z-40">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search')}
            className="w-64 rounded-full bg-muted/50 pl-9 focus-visible:ring-1"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Globe className="h-5 w-5" />
              <span className="hidden sm:inline-block text-sm font-medium">
                {languageOptions.find(l => l.code === language)?.label || "English"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languageOptions.map((lang) => (
              <DropdownMenuItem 
                key={lang.code} 
                onClick={() => handleLanguageChange(lang.code)}
                className="justify-between"
              >
                {lang.label}
                {language === lang.code && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.success(t('openingHelpCenter'))}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>{t('helpCenter')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Ctrl+K")}>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>{t('keyboardShortcuts')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast(t('feedbackThanks'))}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>{t('giveFeedback')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 pl-2 border-l cursor-pointer hover:bg-muted/50 p-1 rounded-md transition-colors">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-medium leading-none">{firstName}</p>
                <p className="text-xs text-muted-foreground">{t('admin')}</p>
              </div>
              <Avatar>
                <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
                <AvatarFallback>{firstName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
