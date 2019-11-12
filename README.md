# Useweb Drone

> Outil de déploiement de code sur le serveur courant.

## Features

Se contente de réceptionner le colis (payload), via les git webhooks puis d'effectuer la livraison, en lançant un `git pull` sur les différents répertoires dédiés au projet, d'où son nom ;)

## Setup

Configurer les variables d'environnements suivants :

* WEBHOOK_PATH : Chemin HTTP d'écoute du payload, à la racine par défaut.
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
