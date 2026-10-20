# Originaux

Photos et logos d'origine, gardés comme sources. Ils ne sont pas déployés (seul `src/assets` l'est).
Les versions servies par le site sont redimensionnées à partir de ces fichiers, dans `src/assets/photos`, `src/assets/equipe`, `src/assets/partenaires` et `src/assets/logo`.

Elles sont en WebP. Pour ajouter une photo, partir de l'original et le convertir à la taille voulue :

```sh
python design/webp.py originaux/image_events/boxe1.jpg src/assets/photos/boxe.webp --size 900x1200
```

`src/assets/logo/logo-mille-idees.png` (336 px) ne sert qu'aux données structurées de `src/index.html` : Google veut un logo d'au moins 112 px. Les pages chargent `logo-mille-idees.webp`.
