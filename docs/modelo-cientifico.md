# Documentação do Modelo Científico — SimFoto

## 1. Modelo de Fotossíntese

### Base Científica
Implementado com o modelo Farquhar-von Caemmerer-Berry simplificado (FvCB), adaptado para fins educacionais.

### Equação de Taxa Bruta
```
taxa_PS = Vmax × min(f_luz, f_CO₂) × f_H₂O × f_temp × f_estom
```

### Fatores

#### Fator de Luz (Hiperbólica de Blackman)
```
f_luz = (2 × L) / (1 + L)    onde L = intensidade / 100

Comportamento:
  L = 0%  → f_luz = 0.00   (sem fotossíntese)
  L = 25% → f_luz = 0.40   (começa a saturar)
  L = 50% → f_luz = 0.67   (saturação parcial)
  L = 75% → f_luz = 0.86   (quase máximo)
  L = 100%→ f_luz = 1.00   (saturação total)
```

**Correção conceitual C14**: Demonstra que luz fornece ENERGIA, não calor.

#### Fator CO₂ (Michaelis-Menten)
```
f_CO₂ = [CO₂] / ([CO₂] + Km)    Km = 200 ppm

Comportamento:
  [CO₂] = 0 ppm  → f_CO₂ = 0.00
  [CO₂] = 200    → f_CO₂ = 0.50  (ponto médio = Km)
  [CO₂] = 400    → f_CO₂ = 0.67  (atmosfera atual)
  [CO₂] = 800    → f_CO₂ = 0.80
  [CO₂] = 2000   → f_CO₂ = 0.91
```

**Correção conceitual C13**: CO₂ é limitante → CO₂ vira massa da planta.

#### Fator Temperatura (Gaussiana)
```
f_temp = exp(-0.5 × ((T - Topt) / σ)²)

Topt = 25°C  (temperatura ótima, enzimas em máxima atividade)
σ = 8°C      (amplitude — maioria das espécies tropicais)

Comportamento:
  T = 5°C  → f_temp = 0.11  (enzimas lentas)
  T = 15°C → f_temp = 0.54
  T = 25°C → f_temp = 1.00  (ÓTIMO)
  T = 35°C → f_temp = 0.54
  T = 42°C → f_temp = 0.08  (desnaturação)
```

#### Fator Estômatos
```
f_estom = 1.00  (abertos)
f_estom = 0.04  (fechados — 96% de redução no CO₂ disponível)
```

**Correção conceitual C04**: Estômatos fechados ≠ PS = 0, mas quase zero.

---

## 2. Modelo de Respiração Celular

### Equação
```
taxa_Resp = R_base × Q₁₀^((T - T_ref) / 10)

R_base = 10 % Vmax (a 25°C — ~10% da PS máxima)
Q₁₀   = 2.0         (dobra a cada 10°C — valor padrão)
T_ref  = 25°C
```

### Comportamento
```
T = 5°C  → R = 2.5%
T = 15°C → R = 5.0%
T = 25°C → R = 10.0%
T = 35°C → R = 20.0%
T = 45°C → R = 40.0% (enzimas ainda mais ativas antes de desnaturar)
```

### Ponto de Compensação
O **ponto de compensação luminosa** é atingido quando:
```
taxa_PS = taxa_Resp
```
Na simulação padrão (T=25°C, CO₂=800ppm): ocorre em aproximadamente **luz ≈ 15%**

---

## 3. Balanço de Carbono

### Por tick (Δt = 0.1 s)
```
carbono_fixado   = taxa_PS   × Δt × 0.004
carbono_oxidado  = taxa_Resp × Δt × 0.004

Δglucose = carbono_fixado - carbono_oxidado
Δbiomassa = (carbono_fixado - carbono_oxidado) × 0.3
```

**Correção conceitual C10**: 90%+ da biomassa vem do CO₂ fixado.

---

## 4. Fase Luminosa (Visualização)

### Fotossistema II (P680)
```
H₂O → O₂ + 4H⁺ + 4e⁻
```
- Absorção máxima: 680 nm (vermelho)
- Elétrons excitados fluem para PQ

### Cadeia de Transporte de Elétrons
```
PSII → PQ → Complexo Cit b6f → PC → PSI → NADP+/NADPH
```

### Gradiente de Prótons → ATP
```
4H⁺ (lúmen → estroma) → 1 ATP  (via ATP-sintase)
```

### Fotossistema I (P700)
```
NADP⁺ + 2H⁺ + 2e⁻ → NADPH
```

### Balanço da Fase Luminosa (por mol de glicose)
```
12 H₂O  → 6 O₂ + 24H⁺ + 24e⁻
18 ATP produzido
12 NADPH produzido
```

---

## 5. Ciclo de Calvin (Fase Escura)

### Etapas
```
1. CARBOXILAÇÃO:
   CO₂ + RuBP (C5) → 2× 3-PGA (C3)    [enzima: RuBisCO]

2. REDUÇÃO:
   3-PGA + ATP + NADPH → G3P + ADP + NADP⁺ + Pᵢ

3. REGENERAÇÃO:
   5× G3P + 3 ATP → 3× RuBP

SAÍDA:
   1× G3P (C3) livre → precursor de glicose (C₆H₁₂O₆)
```

### Balanço por molécula de glicose
```
6 CO₂ + 18 ATP + 12 NADPH → C₆H₁₂O₆ + 18 ADP + 12 NADP⁺ + 6 H₂O
```

---

## 6. Respiração Celular (Visualização)

### Local: Mitocôndria
```
Glicólise (citoplasma):    C₆H₁₂O₆ → 2 Piruvato + 2 ATP + 2 NADH
Ciclo de Krebs (matriz):   2 Piruvato → 6 CO₂ + 2 ATP + 8 NADH + 2 FADH₂
CTE mitocondrial:          10 NADH + 2 FADH₂ + 6 O₂ → H₂O + ~32 ATP
```

**Correção conceitual C05**: RS e PS são processos DISTINTOS com mecanismos diferentes.
**Correção conceitual C06**: Respiração NUNCA para; conta= sempre > 0.5% Vmax.

---

## 7. Estruturas Representadas por Nível

| Nível | Estruturas | Processos |
|---|---|---|
| 0 — Ambiente | Céu, solo, planta, moléculas | PS global, crescimento |
| 1 — Planta | Raiz, caule, xilema, floema, folhas | Transporte, trocas gasosas |
| 2 — Folha | Cutícula, mesófilo, estômatos, xilema/floema | Difusão CO₂/O₂, transpiração |
| 3 — Célula | Parede, vacúolo, cloroplastos, mitocôndrias | PS + resp simultâneos |
| 4 — Cloroplasto | Grana, tilacóides, estroma, ATP-sintase | Fase luminosa + Calvin |
| 5 — Molecular | PSII, PQ, Cyt b6f, PC, PSI, ATP-sintase, Calvin | ETC completa |

---

## 8. Referências

- **Farquhar, von Caemmerer & Berry (1980)** — Biochemical model of CO₂ assimilation
- **Taiz & Zeiger** — Plant Physiology (5ª ed.)
- **Berg, Tymoczko & Stryer** — Biochemistry (8ª ed.)
- **Alberts et al.** — Molecular Biology of the Cell
- **Raven, Johnson** — Biology (10ª ed.)
