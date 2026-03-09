# Assets — SimFoto

Esta pasta contém os recursos visuais do simulador.

## Estrutura SVG

Coloque seus SVGs seguindo esta hierarquia:

```
svg/
  planta/
    planta.svg              # Vista completa da planta
    raiz/
      raiz.svg
      pelos_absorventes.svg
      fluxo_agua.svg
    caule/
      caule.svg
      xilema.svg
      floema.svg
    folha/
      folha.svg
      estomatos.svg
      mesofilo.svg
      nervuras.svg
    flor/
      flor.svg

  folha_zoom/
    folha_zoom.svg
    estomato/
      estomato.svg
      celulas_guarda.svg
      poro.svg

  celular/
    celula_vegetal.svg
    cloroplasto/
      cloroplasto.svg
    mitocondria/
      mitocondria.svg
    vacuolo/
      vacuolo.svg

  cloroplasto/
    tilacoide/
      tilacoide.svg
      grana.svg
    estroma/
      estroma.svg

  molecular/
    fotossistema_II/
      psII.svg
    cadeia_transporte_eletrons/
      ctc.svg
    fotossistema_I/
      psI.svg
    ATP_sintase/
      atp_sintase.svg
    ciclo_calvin/
      calvin.svg
```

## Formato dos SVGs

Cada SVG deve:
- Ter viewBox definido (ex: `viewBox="0 0 200 200"`)
- Usar IDs descritivos nas partes animáveis
- Incluir arquivo `metadata.json` na mesma pasta

## Exemplo de metadata.json

```json
{
  "estrutura": "cloroplasto",
  "descricao": "Cloroplasto com tilacóides e estroma",
  "partes_animaveis": ["grana", "atp_sintase", "eletrons"],
  "escala_nivel": 4,
  "cor_primaria": "#2e7d32",
  "referencias": ["Berg 2015", "Alberts 2014"]
}
```
