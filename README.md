# 🌿 SimFoto — Simulador Interativo de Fotossíntese

> Inspirado na filosofia PhET Interactive Simulations (University of Colorado Boulder)

Um simulador científico educacional completo que conecta **6 níveis de escala** — do ecossistema ao nível molecular — para ensinar fotossíntese e corrigir **14 concepções alternativas** comuns.

---

## 🚀 Deploy no GitHub Pages

1. Faça fork ou clone este repositório
2. Vá em **Settings → Pages**
3. Em *Source*, selecione **main** / **root**
4. Acesse: `https://seu-usuario.github.io/simfoto/`

Ou abra `index.html` diretamente no navegador — **não requer servidor**.

---

## 🎮 Como usar

### Controles laterais (esquerda)
| Controle | Efeito |
|---|---|
| Intensidade Luminosa | Ativa/desativa fotossíntese |
| Concentração CO₂ | Limita ou acelera fixação de carbono |
| Água no Solo | Controla abertura dos estômatos |
| Temperatura | Afeta enzimas (ótimo = 25°C) |
| Estômatos Abertos | Permite/bloqueia troca gasosa |
| Espectro de luz | Demonstra absorção seletiva da clorofila |

### Experimentos prontos
- **Remover toda a luz** — fotossíntese = 0, respiração continua (corrige C07)
- **Remover CO₂** — mesmo com luz, PS = 0 (corrige C13)
- **Secar o solo** — estômatos fecham automaticamente
- **Simular noite** — luz=0, temp=18°C, respiração persiste

### Navegação por níveis (abas superiores)
```
🌍 Ambiente  →  🌿 Planta  →  🍃 Folha  →  🔬 Célula  →  💚 Cloroplasto  →  ⚛️ Molecular
```

---

## 📚 Concepções Alternativas Corrigidas

| ID | Concepção Incorreta | Como é Corrigida |
|---|---|---|
| C01 | Plantas obtêm alimento do solo | Biomassa cresce com CO₂, não com solo |
| C02 | Água e sais minerais são alimento | H₂O é matéria-prima, não produto final |
| C03 | Fotossíntese ocorre apenas nas folhas | Demonstrado em caules e vagens (nível planta) |
| C04 | Fotossíntese é apenas troca de gases | Glicose e ATP são mostrados explicitamente |
| C05 | Fotossíntese é a respiração da planta | Dois processos simultâneos visíveis |
| C06 | Plantas não respiram | Taxa de respiração sempre > 0 |
| C07 | Plantas respiram apenas à noite | Respiração ativa mesmo com luz acesa |
| C08 | Respiração é o inverso da fotossíntese | Mecanismos bioquímicos diferentes visíveis |
| C09 | Energia luminosa é perdida | Convertida em ATP → NADPH → glicose |
| C10 | Massa da planta vem do solo | Biomassa = CO₂ fixado (rastreável) |
| C11 | Açúcar não é produzido pela planta | G3P → glicose animado no Ciclo de Calvin |
| C12 | Plantas não produzem energia química | ATP e NADPH com contador em tempo real |
| C13 | CO₂ não contribui para massa da planta | CO₂=0 → crescimento para |
| C14 | Luz serve apenas para aquecer | Excitação de elétrons na clorofila animada |

---

## 🔬 Modelo Científico

### Fotossíntese (Modelo Farquhar simplificado)
```
taxa_PS = 100 × min(f_luz, f_CO₂) × f_H₂O × f_temp × f_estom

f_luz  = 2×(L/100) / (1 + L/100)          [hiperbólica]
f_CO₂  = CO₂ / (CO₂ + 200)                [Michaelis-Menten, Km=200ppm]
f_H₂O  = H₂O / (H₂O + 15)                 [Michaelis-Menten]
f_temp = exp(-0.5 × ((T-25)/8)²)           [Gaussiana, ótimo=25°C]
f_estom = 1.0 (aberto) | 0.04 (fechado)
```

### Respiração Celular (Q₁₀ = 2.0)
```
taxa_Resp = 10 × 2^((T-25)/10)    [sempre ativa, dia e noite]
```

### Balanço de Carbono
```
ΔBiomassa = (taxa_PS - taxa_Resp) × dt
```

---

## 🏗️ Arquitetura

```
index.html (auto-contido, ~5000 linhas)
├── CSS          — Design científico com variáveis custom
├── HTML         — Layout grid 3 colunas
└── JavaScript
    ├── Estado E          — Variáveis reativas centralizadas
    ├── Motor             — Modelo científico (calcPS, calcResp, tick)
    ├── SistemaParticulas — Animações de moléculas
    ├── D (utilitários)   — Desenho Canvas 2D
    ├── NivelAmbiente     — Renderizador nível 0
    ├── NivelPlanta       — Renderizador nível 1
    ├── NivelFolha        — Renderizador nível 2
    ├── NivelCelula       — Renderizador nível 3
    ├── NivelCloroplasto  — Renderizador nível 4
    ├── NivelMolecular    — Renderizador nível 5
    ├── Concepcoes        — Sistema de 14 correções
    ├── Graficos          — Mini-gráfico histórico
    └── UI                — Gerenciador de interface
```

### Loop de Atualização
- **Renderização**: 60 fps via `requestAnimationFrame`
- **Simulação**: 10 fps (tick a cada 100ms)
- **Partículas**: `requestAnimationFrame` (suavizado)

---

## 🛠️ Adicionando SVGs Personalizados

Coloque SVGs na pasta `assets/svg/` seguindo a estrutura abaixo.
O simulador carregará automaticamente se você referenciar no código:

```
assets/svg/
  planta/
    planta.svg
    raiz/raiz.svg
    caule/xilema.svg
    folha/folha.svg
  celular/
    celula_vegetal.svg
    cloroplasto/cloroplasto.svg
  molecular/
    fotossistema_II/psII.svg
    ciclo_calvin/calvin.svg
```

---

## 📦 Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5 Canvas 2D** | Renderização de todos os 6 níveis |
| **CSS3 Custom Properties** | Sistema de cores científicas |
| **JavaScript ES6+** | Motor de simulação e UI |
| **Google Fonts** | Exo 2 + JetBrains Mono |

Sem dependências externas de JS. Funciona offline.

---

## 📄 Licença

MIT License — livre para uso educacional e modificação.

---

*Desenvolvido com arquitetura modular inspirada no PhET Interactive Simulations, University of Colorado Boulder.*
