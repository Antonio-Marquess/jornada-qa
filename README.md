# Jornada QA — Além do Teste

Um mapa interativo para começar e crescer em qualidade de software, com IA no dia a dia desde o primeiro passo.

**Versão 0.1** · funciona direto no navegador, sem instalar nada.

## O que tem

| Aba | Conteúdo |
| --- | --- |
| Mapa | Mapa mental da trilha em 5 etapas e 70 tópicos, com as tecnologias de cada um, busca, anotações e progresso |
| Rota de estudo | A mesma trilha em sequência, com checklist e prévia das anotações |
| IA no dia a dia | Onde a IA ajuda, MCP explicado, servidores MCP úteis para QA, agentes de teste do Playwright, regras de ouro e exercícios |
| Prompts | Biblioteca de prompts para QA, com filtro por categoria e botão de copiar |
| Biblioteca | Artigos, documentação, sites para praticar, repositórios, cursos, canais, roadmaps e comunidades, com filtros por tipo, etapa e tema |
| Projetos | Projetos guiados para o portfólio, em ordem de dificuldade |

Cada tópico abre com:

- **O que estudar:** os subtemas, em checklist
- **Materiais:** links com a indicação do que ler ou fazer em cada um
- **Pratique:** exercício com aplicação, passos e entrega; quando faz sentido, um **laboratório** pronto para copiar (comandos Docker, scripts SQL, história de exemplo, modelos)
- **Pronto quando:** critérios para saber que terminou
- **Minhas anotações**

O progresso (tópicos dominados, checklists, exercícios e projetos concluídos) e as anotações ficam salvos no navegador de cada pessoa.

## Versões

**v0.1** (primeira versão publicada)

- Trilha em 5 etapas com 70 tópicos, do zero ao sênior
- Todos os tópicos com o que estudar, materiais, exercício e critérios de conclusão; laboratórios prontos para SQL, MongoDB, RabbitMQ, Juice Shop, k6, Docker e outros
- Abas IA no dia a dia (com MCP e agentes de teste), Prompts, Biblioteca e Projetos
- Tudo editável pela página, com backup e publicação em Seus dados

## Editar pela própria página

Não existe modo de edição: tudo se edita no lugar, como no Notion ou no Trello.

- **Rota de estudo:** passe o mouse num tópico e use os ícones de editar ou excluir. **Adicionar tópico** fica no fim de cada etapa, e o ícone ao lado do nome da etapa muda nome e objetivo.
- **Mapa:** clique num tópico para abrir os detalhes e use **Editar**. O botão **Novo tópico** fica no topo.
- **Prompts e Biblioteca:** **Novo prompt** e **Adicionar link** no topo; editar e excluir aparecem ao passar o mouse.
- **Anotações:** cada tópico tem um campo "Minhas anotações". Links escritos ali viram links clicáveis.

Backup e publicação ficam em **Seus dados**, na barra lateral:

| Ação | O que faz |
| --- | --- |
| Exportar backup | Baixa um `.json` com conteúdo, anotações e progresso |
| Importar backup | Carrega esse `.json` em outro navegador ou computador |
| Publicar no GitHub | Gera o arquivo `personalizado.js` com o conteúdo editado (sem anotações nem progresso) |
| Restaurar original | Descarta as edições de conteúdo deste navegador; anotações e progresso continuam |

### Publicar suas edições para todos

1. Em **Seus dados**, clique em **Gerar arquivo** (Publicar no GitHub).
2. Substitua o arquivo `data/personalizado.js` do repositório pelo que foi baixado e faça o commit.
3. Quem abrir o site passa a ver o seu conteúdo. Quem tiver edições próprias salvas no navegador continua vendo a versão dele até clicar em **Restaurar original**.

## Rodar localmente

Abra o arquivo `index.html` no navegador. Pronto.

## Publicar no GitHub Pages

1. Crie um repositório, por exemplo `jornada-qa`, e envie todos os arquivos desta pasta para a branch `main`.
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em alguns minutos o site estará em `https://SEU-USUARIO.github.io/jornada-qa/`.

Dá para abrir uma aba direto pelo endereço: `#mapa`, `#rota`, `#ia`, `#prompts`, `#biblioteca` ou `#projetos`.

## Estrutura

```
jornada-qa/
├── index.html          estrutura da página e das abas
├── css/styles.css      visual (claro e escuro)
├── js/app.js           comportamento: mapa, abas, filtros, progresso
└── data/               todo o conteúdo, separado do layout
    ├── trilha.js       etapas e tópicos do mapa
    ├── ia.js           aba IA no dia a dia
    ├── prompts.js      biblioteca de prompts
    ├── biblioteca.js   links da biblioteca e projetos
    └── personalizado.js conteúdo editado pela página (substitui o padrão quando preenchido)
```

Os dados ficam em arquivos `.js`, e não `.json`, para o site continuar funcionando quando aberto direto do computador (o navegador bloqueia a leitura de `.json` nesse caso).

## Editar direto nos arquivos

**Um tópico do mapa** (`data/trilha.js`):

```js
{s:"e2", t:"Testes de API", p:"Autonomia", pr:"Essencial",
 d:"Descrição curta.",
 est:["REST: recursos e verbos", "Asserções de status e corpo"],
 tech:["Bruno","Postman","REST"],
 l:[["ServeRest","https://serverest.dev/","Leia os endpoints de usuários e login"]],
 x:"Exercício prático.",
 lab:`comandos ou dados para copiar`,
 cc:["Minha coleção roda inteira sem eu editar nada"]}
```

| Campo | Significado |
| --- | --- |
| `s` | Etapa: `e1`, `e2`, `e3`, `e4`, `e5` |
| `t` | Título (também gera o identificador usado no progresso salvo) |
| `p` | Profundidade: Conhecer, Praticar com apoio, Autonomia, Aprofundar |
| `pr` | Prioridade: Essencial, Diferencial, Diferencial forte, Escolha uma |
| `ia` | `true` para destacar como tópico de IA |
| `d` | Descrição |
| `est` | O que estudar (lista) |
| `tech` | Tecnologias e conceitos (aparecem no mapa e na busca) |
| `l` | Materiais: `[texto, endereço, o que ler nele]`; o terceiro item é opcional |
| `x` | Exercício prático |
| `lab` | Laboratório para copiar (opcional) |
| `cc` | Critérios de conclusão (lista) |

**Um item da biblioteca** (`data/biblioteca.js`):

```js
{tipo:"artigo", t:"Título", u:"https://...", e:"e3", tema:"Automação", d:"Por que vale ler."}
```

Tipos: `artigo`, `doc`, `pratica`, `repo`, `curso`, `canal`, `roadmap`, `comunidade`. Use `pago:true` para cursos pagos e `e:"todas"` para itens que servem a qualquer etapa.

**Um prompt** (`data/prompts.js`):

```js
{c:"Categoria", t:"Título", quando:"Quando usar.", p:`Texto do prompt`}
```

## Próximas ideias

- **v0.2:** minimapas por área (Segurança, Performance, Automação, API, IA, Mobile, Dados e DevOps), cada um com tópicos, ferramentas e o que estudar

- Aba Ferramentas: catálogo por tipo de teste, com quando usar cada uma
- Aba Dicas: carreira, entrevistas e currículo
- Aba Glossário: termos de QA em linguagem simples
- Edição das abas IA no dia a dia e Projetos
- Busca global (Ctrl+K) em todas as abas

## Licença

Código sob licença MIT. Veja `LICENSE`.
