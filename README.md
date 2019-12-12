# Useweb Drone

> Outil de déploiement de code.

## Features

Se contente de réceptionner le colis (payload) via les git webhooks puis d'effectuer la livraison, en lançant un `git pull` sur les différents répertoires dédiés aux projets.
Permet également de mettre à jour par action manuelle différents projets sur différents serveurs, couramment ceux de production.

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

### Autodeploy via action manuelle

Configurer les variables d'environnements suivants :

* WEBPULL_PATH : Chemin HTTP pour la demande de mise à jour, sur /prod par défaut.
* PULL_KEY : Clé de protection à transmettre dans la requête POST de demande de mise à jour.
* SSH_KEY : Clé SSH privée de l'utilisateur courant.

Voici le format de body à utiliser dans l'appel POST vers le endpoint :

```json
{
  "name": "nomprojet",
  "key": "macle"
}
```

Le git pull s'effectuera sur l'ensemble des serveurs "nodes" indiqués pour chque projet.
Pour configurer la liste des serveurs par projet, créer un fichier `servers.json` à la racine. Un format d'example du fichier :

```json
{
  "nomprojet": {
    // Utilisateur pour la connection SSH
    "username": "useweb",
    // Liste des serveurs "node" à mettre à jour
    "servers": ["laforet-prod-web1.useweb.net", "laforet-prod-web2.useweb.net"],
    // Liste des répertoires à mettre à jour
    "dirs": [
      "/var/www/laforet-back",
      "/var/www/laforet-front"
    ],
    // Scripts de déploiement
    "scripts": [
      "my-script"
    ]
  }
}
```
