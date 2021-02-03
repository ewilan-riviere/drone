# Useweb Drone

> Outil de déploiement de code par [**adr1enbe4udou1n**](https://github.com/adr1enbe4udou1n)

```bash
cp pre-deploy.sh.example pre-deploy.sh
cp post-deploy.sh.example post-deploy.sh
cp repositories.json.example repositories.json
```

Update in `repositories.json` with any local repository minimum

```json
{
  "remote-repo": [
    "local-repo"
  ]
}
```

Update `pre-deploy.sh` if you need any pre-deploy methods

```bash
# ...

# pm2 stop application
```

```bash
sudo chmod 775 pre-deploy.sh ; sudo chmod 775 post-deploy.sh 
```

## Features

Se contente de réceptionner le colis (payload) via les git webhooks puis d'effectuer la livraison, en lançant un `git pull` sur les différents répertoires dédiés aux projets.
Permet également de lancer n'importe quel script bash quelconque.

## Setup

### Autodeploy via Git Hooks

Configurer les variables d'environnements suivants :

* WEBHOOK_PATH : Chemin HTTP d'écoute du payload des git hooks, sur /deploy par défaut.
* PROJECTS_ROOT : Répertoire racine contenant la liste des différents projets clonés.

Par défaut le git pull s'effectue sur un nom de répertoire semblable au nom slugifié du répository.
Il est tout a fait possible de configurer pour chaque projet un ou plusieurs répertoire de noms différents où le `git pull` doit s'effectuer. Pour cela, créer un fichier `repositories.json` à la racine. Un format d'example du fichier :

```json
{  
  "nom-du-repo-1":[
     "autre-nom-du-repo-1"
  ],
  "nom-du-repo-2":[
     "nom-du-repo-2-dev",
     "nom-du-repo-2-rec"
  ]
}
```

### Exécution d'un script via POST

Configurer les variables d'environnements suivants :

* WEBSCRIPT_PATH : Chemin HTTP pour la demande lancement du script, sur /script par défaut.
* SCRIPT_KEY : Clé de protection à transmettre dans la requête POST.

Voici le format de body à utiliser dans l'appel POST vers le endpoint :

```json
{
  "name": "nomprojet",
  "key": "macle"
}
```

La liste des commandes disponibles doit être listé dans un fichier `commands.json` au format suivant :

```json
{
  "nomcommande": "my-script"
}
```
