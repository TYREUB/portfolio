# Portfolio — Tyreub

Petite page statique (HTML/CSS/JS) pour présenter ton profil et tes compétences.

Comment lancer localement

- Ouvrir `index.html` dans le navigateur (double-clic) ou
- Lancer un serveur local (recommandé) depuis le dossier `Portfolio` :

```bash
# avec Python 3
python3 -m http.server 8000

# puis ouvrir http://localhost:8000
```

À personnaliser

- Remplace `tyreub@example.com` par ton adresse email réelle.
- Ajoute tes projets réels dans la section `Projets`.
- Tu peux modifier les couleurs dans `styles.css` (variables : `--blue`, `--pink`, `--bg`).

Ajouter le CV téléchargeable

- Place le fichier PDF `Najib Adem CV.pdf` à la racine du dossier `Portfolio` (même dossier que `index.html`). Le bouton "Télécharger mon CV" dans la section Contact liera ce fichier et permettra aux visiteurs de le télécharger.

Exemple (macOS / Linux) :

```bash
# depuis le terminal, si le fichier est dans Downloads
cp ~/Downloads/Najib\ Adem\ CV.pdf /Users/tyreub/Desktop/Portfolio/
```
