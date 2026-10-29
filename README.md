# 🔫 NEON SIEGE (versión solo, sin online)
Shooter top-down de supervivencia por oleadas, en el navegador. Sobrevive a hordas de enemigos neón, derrota a los jefes y entra en el ranking.

## ▶ Cómo ejecutarlo
Abre `client/index.html` en el navegador (o despliégalo en GitHub Pages). Versión **solo** (sin modo online): el ranking y los ajustes se guardan en tu navegador (localStorage).

## 🎮 Controles (todos reasignables en Ajustes → Controles)
| Acción | Tecla por defecto |
|---|---|
| Mover | W A S D |
| Apuntar | Ratón |
| Disparar | Click izquierdo (mantener) o **J** |
| Cambiar arma | **Q** o teclas **1 / 2 / 3** |
| Esquivar (dash, invulnerable un instante) | Espacio |
| Pausa | Esc |

## 🔫 Armas
1. **Pistola:** equilibrada y precisa.
2. **Escopeta:** 7 perdigones, corto alcance, muy potente de cerca.
3. **Ametralladora:** cadencia altísima con algo de dispersión.

## 👾 Enemigos
- **Perseguidor (rosa):** corre hacia ti.
- **Tirador (naranja):** mantiene la distancia y dispara.
- **Tanque (morado):** lento y con mucha vida.
- **JEFE (rojo):** cada 5 oleadas. Mucha vida y lanza ráfagas de balas en círculo.

## ❤ Objetos
- ❤ Recupera 25 de vida.
- ⚡ Cadencia de disparo aumentada durante 6 s.

## 📋 Menú
- **Jugar:** elige dificultad (Fácil, Normal, Difícil, Pesadilla).
- **Ranking:** top 10 de puntuaciones.
- **Skins:** 10 skins con rareza (Común, Raro, Épico, Legendario), vista previa giratoria y sombreros/estelas. Se equipan con click.
- **Ajustes:**
  - Controles: cambiar teclas, restaurar.
  - Audio: volumen de música y efectos (audio generado por código).
  - Gráficos: calidad (Baja/Media/Alta con brillos), partículas, sacudida de pantalla, efecto CRT, FPS, pantalla completa.
- **Cómo jugar:** resumen de controles.

## 📁 Estructura
```
neon-siege-solo/
├── README.md
├── .github/workflows/pages.yml   despliegue automático en GitHub Pages
└── client/                       el juego (HTML + CSS + JS)
```
