# Windows
 
PREPARING AND SETTINGS WINDOWS FOR RUST PROGRAMMING

A. CUSTOMIZE WINDOWS TERMINAL
  
  ⚙ Tools & configuration files
 
  	🚀 Download Terminal App & Powershell in microsoft store
	🚀 Download my configuration files & extract
	   📝 .starship\starhsip.toml
	   📝 PowerShell\Microsoft.PowerShell_profile.ps1
	   📝 WindowsTerminal\settings.json
	🚀 Install nerd font https://www.nerdfonts.com/
	   📝 HackNerdFont\*
	🚀 Open notepad & setting default font
	🚀 Open Terminal 
	🚀 Install scoop https://scoop.sh/
	   👀 irm get.scoop.sh | iex
	🚀 Install starship https://starship.rs/
	   👀 scoop install starship 
	   👀 $PROFILE
	   👀 ~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
	   👀 mkdir ~\Documents\PowerShell
	   👀 notepad ~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
	🚀 Copy my configuration file 📝 .starship\starhsip.toml
	   👀 cp C:\Users\username\Downloads\.starship\starhsip.toml C:\Users\username\.starship\starhsip.toml
	🚀 Open my configuration file  📝 WindowsTerminal\settings.json & copy
	   👀 notepad C:\Users\username\Downloads\WindowsTerminal\settings.json
	🚀 Go to terminal and press [CTRL + ,] for Terminal Settings
	🚀 Open JSON File, select all [CTRL + A] and paste here [CTRL + V],  Save & exit
	🚀 Add new tab in terminal and tadaaaa..!!! your terminal looks powerfull
	   

B. CONFIGURING WSL2 IN WINDOWS 10/11
   1. Enabled hyper-v on BIOS
   2. Turn windows features on or off
	
	🚀 [✔]virtual machine platform 
   	🚀 [✔]windows subsystem for linux
   	🚀 restart
	
   3. Download update wsl version 2

   	🚀 https://docs.microsoft.com/en-us/windows/wsl/install-win10
   	🚀 https://docs.microsoft.com/en-us/windows/wsl/install-manual
	
   4. Install ubuntu subsystem from microsoft store
   5. Set WSL version
  
   	🚀 Open PowerShell
	   👀 wsl -l -v
	   👀 wsl --set-version Ubuntu-20.04 2 
	   👀 wsl --set-default-version 2
	   
   6. Update Package

	🚀 Open ubuntu subsystem
	   👀 lsb_release -a
	   👀 sudo apt update && upgrade
	   
   7. WSL Help & Shutdown from PowerShell
 
	🚀 Open PowerShell
	   👀 wsl --help
	   👀 wsl --shutdown

C. SETTUNG UP TOOLS FOR RUST
   1. Installing Rust
 
	🚀 Rust for Linux
	   👀 curl https://sh.rustup.rs -sSf } | sh
	   👀 source $HOME/.cargo/env
	   👀 export PATH="$HOME/.cargo/bin:$PATH"
	   👀 sudo apt install build-essential
  	🚀 Rust for Windows
	   👀 https://www.rust-lang.org/tools/install
	   
   3. MSVC C++ Build tools
  
 	🚀 https://visualstudio.microsoft.com/visual-cpp-build-tools/ 
	
   4. Visual Studio Code
   
	🚀 https://code.visualstudio.com/Download
	
   5. Install Extention
   
 	🚀 Rust and Friends by Nyxiative
	   👀 Better TOML
	   👀 crates
	   👀 rust-analyzer
	   👀 Bracket Pair Colorizer 2
	   👀 CodeLLDB
	   👀 Rust Syntax
	   👀 Syntax Highlighter
	   👀 Rust Doc Viewer
	   👀 Rust Targets
	   👀 Rust Mod Generator
	   👀 Rust Flash Snippets
	🚀 Remote Development by Microsoft
	   👀 Remote - WSL
	   👀 Remote - Containers
	   👀 Remote - SSH
	🚀 Install Theme 
	   👀 Material Icon Theme by Philipp Kief
	   👀 Helium Icon Theme by Halgard Richard Ferreira
	   👀 The Best Theme by Jan Kohlbach
	   👀 TwoStones Theme by gerane

D. PLAY RUST
   1. Hello wordl!

