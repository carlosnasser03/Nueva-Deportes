# Conectar este repositorio a GitHub

Opciones rápidas para conectar y poder `commit` y `push` fácilmente.

## 1) Preparar identidad Git (local)
Ejecuta (rellena tu nombre y email):

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"
```

## 2) Crear el repo en GitHub
Opción A — con GitHub web:
- Crea un nuevo repositorio en https://github.com/new
- Copia la URL (SSH o HTTPS)
- En tu proyecto local añade el remote:

```powershell
# SSH
git remote add origin git@github.com:TU_USUARIO/TU_REPO.git
# HTTPS
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
```

Opción B — con GitHub CLI (recomendado si lo tienes):

```powershell
# instalar gh: https://cli.github.com/
gh auth login
gh repo create TU_USUARIO/TU_REPO --public --source=. --remote=origin --push
```

> Nota: `gh` simplifica añadir el remote y empujar el primer commit.

## 3) Autenticación
- SSH (recomendado):
  - Generar clave si no existe:

```powershell
ssh-keygen -t ed25519 -C "tu@correo.com"
# luego copia la clave pública (~/.ssh/id_ed25519.pub) y añádela a GitHub
```

  - O con `gh`:

```powershell
gh ssh-key add ~/.ssh/id_ed25519.pub -t "Mi máquina"
```

- HTTPS con PAT (alternativa):
  - Crea un Personal Access Token en https://github.com/settings/tokens (scopes: repo)
  - Usa el token cuando `git push` pida contraseña o configúralo en el helper de credenciales.

## 4) Uso rápido (scripts incluidos)
- PowerShell:

```powershell
.\scripts\commit-and-push.ps1 -Message "Mi mensaje de commit" -Branch main
```

- Bash:

```bash
./scripts/commit-and-push.sh "Mi mensaje de commit" main
```

Estos scripts hacen `git add .`, `git commit -m` y `git push origin <branch>`.

## 5) Si quieres, puedo:
- crear el repo en GitHub automáticamente (requiere `gh` o un PAT que tú proveas),
- generar una clave SSH y ayudarte a añadirla a GitHub (con `gh` o manualmente),
- añadir un `npm` script para ejecutar el script de commit.

Dime qué prefieres y lo dejo listo.
