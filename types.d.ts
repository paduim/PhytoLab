/**
 * SimFoto — Definições de Tipos TypeScript
 * Para uso em extensões ou versão compilada do simulador.
 */

// ── Estado Global ──────────────────────────────────────────────

export interface EstadoSimulacao {
  // Variáveis de controle
  luz:       number;   // 0–100 %
  co2:       number;   // ppm (0–2000)
  h2o:       number;   // 0–100 %
  temp:      number;   // °C (0–45)
  stom:      boolean;  // estômatos abertos
  raiz:      boolean;  // raízes absorvendo
  floema:    boolean;  // transporte floema
  espectro:  Espectro; // cor da luz

  // Taxas calculadas
  taxaPS:    number;   // 0–100 (escala relativa)
  taxaResp:  number;   // 0–30
  taxaLiq:   number;

  // Estoques
  biomassa:  number;
  glucose:   number;

  // Produções por tick
  atpProd:   number;
  nadphProd: number;
  o2Prod:    number;
  glucProd:  number;

  // Histórico
  hPS:   number[];
  hResp: number[];

  // UI
  nivel: NivelID;
  tick:  number;
  fps:   number;
  tempoAnim: number;

  // Concepções corrigidas
  corrigidas: Set<string>;
}

export type Espectro = 'branca' | 'azul' | 'vermelho' | 'verde';
export type NivelID  = 0 | 1 | 2 | 3 | 4 | 5;

// ── Modelo de Fotossíntese ─────────────────────────────────────

export interface ModeloFotossintese {
  /** Fator de luz (hiperbólica, satura em ~70%) */
  fatorLuz(luz: number, espectro: Espectro): number;
  /** Fator CO₂ Michaelis-Menten (Km = 200 ppm) */
  fatorCO2(co2: number): number;
  /** Fator água Michaelis-Menten (Km = 15%) */
  fatorH2O(h2o: number): number;
  /** Fator temperatura Gaussiana (ótimo = 25°C, σ = 8°C) */
  fatorTemp(temp: number): number;
  /** Taxa bruta 0–100 */
  calcular(estado: EstadoSimulacao): number;
}

export interface ModeloRespiracao {
  /** Q₁₀ = 2.0, base = 10% a 25°C */
  calcular(temp: number, glucose: number): number;
}

// ── Partículas ─────────────────────────────────────────────────

export interface IParticula {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  cor: string;
  vida: number;
  maxVida: number;
  label?: string;
  atualizar(): void;
  morta(): boolean;
  alpha(): number;
}

export type TipoParticula = 'co2' | 'h2o' | 'o2' | 'glucose' | 'atp' | 'nadph' | 'eletron' | 'proton';

// ── Renderizadores ─────────────────────────────────────────────

export interface IRenderizadorNivel {
  render(
    ctx:  CanvasRenderingContext2D,
    W:    number,
    H:    number,
    t:    number,
    estado: EstadoSimulacao
  ): void;
}

// ── Concepções Alternativas ────────────────────────────────────

export interface ConcepcaoAlternativa {
  id:       string;        // 'C01'–'C14'
  txt:      string;        // descrição da concepção incorreta
  correcao: string;        // explicação científica correta
  testar:   () => boolean; // retorna true quando pode ser demonstrada
}

// ── Metadados de SVG ───────────────────────────────────────────

export interface MetadadosSVG {
  estrutura:       string;
  descricao:       string;
  partes_animaveis: string[];
  escala_nivel:    NivelID;
  cor_primaria:    string;
  referencias:     string[];
}

// ── Módulos do Modelo ──────────────────────────────────────────

export interface ModuloFotossintese {
  estado: {
    taxaBruta:  number;
    atpProd:    number;
    nadphProd:  number;
    o2Prod:     number;
    co2Fixado:  number;
  };
  calcular(params: {
    luz: number; co2: number; h2o: number;
    temp: number; stomAberto: boolean; espectro: Espectro;
  }): number;
}

export interface ModuloRespiracao {
  estado: {
    taxaAtual:  number;
    atp:        number;
    co2Emitido: number;
  };
  calcular(temp: number, glucoseDisponivel: number): number;
}

export interface ModuloTransporte {
  xilema: {
    fluxo:      number;  // 0–1
    pressao:    number;
    moleculas:  Array<{ posicao: number; tipo: 'agua' | 'mineral' }>;
  };
  floema: {
    fluxo:      number;
    pressao:    number;
    moleculas:  Array<{ posicao: number; tipo: 'glucose' | 'sacarose' }>;
  };
  atualizar(estado: EstadoSimulacao): void;
}

export interface ModuloAmbiente {
  intensidadeLuz:   number;
  co2Ar:            number;
  umidadeSolo:      number;
  temperatura:      number;
  cicloCircadiano?: number;  // 0–24h
}

export interface ModuloMetabolismoCarbono {
  // Ciclo de Calvin
  rubp:    number;  // ribulose-1,5-bisfosfato
  pga3:    number;  // 3-fosfoglicerato
  bpga13:  number;  // 1,3-bisfosfoglicerato
  g3p:     number;  // gliceraldeído-3-fosfato
  glucose: number;

  cicloCalvin(co2: number, atp: number, nadph: number): number;
}

// ── Evento de Simulação ────────────────────────────────────────

export type EventoSimulacao =
  | { tipo: 'tick';             delta: number }
  | { tipo: 'nivelMudou';       de: NivelID; para: NivelID }
  | { tipo: 'concepcaoCorrigida'; id: string }
  | { tipo: 'experimentoAtivado'; nome: string }
  | { tipo: 'alertaEducacional'; mensagem: string };

export type HandlerEvento = (evento: EventoSimulacao) => void;
