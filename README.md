# DDA Metalúrgica — Sistema de Controle de Estoque (SA1)

Estrutura front-end estática (HTML + CSS) do sistema de controle de estoque de
pastilhas industriais da DDA Metalúrgica. Entrega da **Situação de Aprendizagem 1**
do Projeto Integrador — foco em UX/UI e estrutura visual, sem lógica ou
persistência de dados (isso fica para a SA2).

## Telas

| Arquivo | Tela |
|---|---|
| `index.html` | Painel de estoque (dashboard) |
| `pastilhas.html` | Cadastro de pastilhas |
| `fabricantes.html` | Cadastro e relação de fabricantes |
| `movimentacoes.html` | Registro de entradas e saídas |
| `estoque.html` | Acompanhamento de estoque |
| `css/style.css` | Estilos e design system compartilhado |
| `js/app.js` | Validação de formulários, busca/filtro de tabelas e feedback visual |

## Comportamento do JavaScript (`js/app.js`)

O script cobre apenas interações de interface — **não há persistência de
dados** (isso é escopo da SA2):

- **Validação de formulários**: ao enviar, campos obrigatórios vazios ou
  inválidos (e-mail, quantidade ≤ 0) ficam destacados em vermelho com
  mensagem de erro; se tudo estiver correto, mostra um toast de sucesso e
  limpa o formulário.
- **Busca e filtro de tabelas**: os campos de busca e os `select` de cada
  `.filter-bar` filtram as linhas da tabela em tempo real (client-side); se
  nada corresponder, exibe um estado vazio.
- **Gauges de estoque**: o nível de cada barra é calculado a partir de
  `data-atual` / `data-total` / `data-minimo` no HTML, e a cor muda
  automaticamente (normal / baixo / sem estoque).
- **Toast de feedback**: notificação simples no canto da tela para confirmar
  ações do usuário.

## Como visualizar

Abra `index.html` diretamente no navegador — não depende de servidor, backend
ou build. As fontes (Oswald, Inter, IBM Plex Mono) são carregadas do Google
Fonts; sem internet, o navegador usa as fontes de fallback definidas no CSS.

## Decisões de UX/UI aplicadas

- **Visibilidade do status**: níveis de estoque sempre visíveis via indicador
  de nível (gauge) com marca do mínimo, e badges de status (Normal / Baixo /
  Sem estoque).
- **Prevenção de erros**: seleção de pastilha/fabricante por lista em vez de
  texto livre nas movimentações, evitando divergência de nomes.
- **Consistência**: mesmo menu lateral, mesmo padrão de cabeçalho de tabela e
  botões em todas as telas.
- **Reconhecimento em vez de memorização**: busca com autocomplete
  (`datalist`) ao registrar movimentações.
- Detalhamento completo das heurísticas (Nielsen) na documentação entregue
  junto com esta SA.

## Organização sugerida do repositório Git/GitHub

```
dda-estoque/
├── index.html
├── pastilhas.html
├── fabricantes.html
├── movimentacoes.html
├── estoque.html
├── css/
│   └── style.css
└── README.md
```

### Fluxo de commits sugerido para a equipe

1. `git init` e primeiro commit com a estrutura base (`css/style.css` +
   `index.html`).
2. Um commit (ou branch + PR) por tela adicionada:
   `feat: adiciona tela de cadastro de pastilhas`,
   `feat: adiciona tela de fabricantes`, etc.
3. Commits de ajuste de responsividade e semântica separados dos commits de
   estrutura: `style: ajusta media queries para tablet e mobile`.
4. Cada integrante trabalha em uma branch própria (`feature/tela-fabricantes`,
   `feature/tela-movimentacoes`...) e abre **Pull Request** para a branch
   principal — a atividade exige PR de todos os membros da equipe.
5. Revisar e mesclar os PRs, mantendo o histórico de commits visível como
   evidência da evolução do projeto.
