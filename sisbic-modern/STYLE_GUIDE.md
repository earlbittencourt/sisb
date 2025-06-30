# Guia de Estilo — Sisbic Modern

## Como usar e alterar as variáveis de estilo

Todas as cores, fontes e pesos do sistema são controlados por variáveis do tema no arquivo `tailwind.config.js`.

- **Nunca** use valores hardcoded de cor, fonte ou peso nos componentes.
- Sempre utilize as classes do tema (`stone-*`, `primary`, `danger`, etc) ou crie novas variáveis no `tailwind.config.js` se necessário.
- Para alterar a identidade visual, basta modificar as variáveis do tema.

## Variáveis de cor do tema

| Variável         | Uso principal                                                                 |
|------------------|------------------------------------------------------------------------------|
| `primary`        | Cor principal da identidade visual, botões, links, destaques                  |
| `accent`         | Detalhes de destaque, ícones, elementos secundários                           |
| `stone-*`        | Fundo, bordas, textos neutros, backgrounds principais                         |
| `success`        | Indicadores de sucesso, badges, mensagens positivas                           |
| `danger`         | Indicadores de erro, badges, mensagens de erro                                |
| `warning`        | Indicadores de atenção, badges, mensagens de alerta                           |
| `info`           | Indicadores informativos, badges, mensagens de informação                     |
| `white`/`black`  | Fundo, textos, ícones neutros                                                 |

## Como alterar uma cor

1. Abra o arquivo `tailwind.config.js`.
2. Localize a variável desejada na seção `theme.extend.colors`.
3. Altere o valor hexadecimal conforme a nova identidade visual.
4. Salve e o sistema inteiro refletirá a mudança.

## Exemplo de uso nos componentes

```tsx
<button className="bg-primary text-white hover:bg-primary-dark">Salvar</button>
<span className="text-danger">Erro</span>
<div className="bg-stone-100 border-stone-200 text-stone-800">Conteúdo</div>
```

---

## Esquema de cores do sistema

### Light Mode
| Variável         | Cor (hex)         |
|------------------|------------------|
| `primary`        | #0284c7           |
| `primary-light`  | #38bdf8           |
| `primary-dark`   | #0369a1           |
| `accent`         | #E17A4D           |
| `stone-50`       | #fafaf9           |
| `stone-100`      | #f5f5f4           |
| `stone-200`      | #e7e5e4           |
| `stone-300`      | #d6d3d1           |
| `stone-400`      | #a8a29e           |
| `stone-500`      | #78716c           |
| `stone-600`      | #57534e           |
| `stone-700`      | #44403c           |
| `stone-800`      | #292524           |
| `stone-900`      | #1c1917           |
| `success`        | #34d399           |
| `success-light`  | #a7f3d0           |
| `success-dark`   | #059669           |
| `danger`         | #ef4444           |
| `danger-light`   | #fecaca           |
| `danger-dark`    | #b91c1c           |
| `warning`        | #f59e42           |
| `warning-light`  | #fef3c7           |
| `warning-dark`   | #b45309           |
| `info`           | #0ea5e9           |
| `info-light`     | #bae6fd           |
| `info-dark`      | #0369a1           |
| `white`          | #ffffff           |
| `black`          | #000000           |

### Dark Mode
| Variável         | Cor (hex)         |
|------------------|------------------|
| `primary`        | #0284c7           |
| `primary-light`  | #38bdf8           |
| `primary-dark`   | #0369a1           |
| `accent`         | #E17A4D           |
| `stone-50`       | #fafaf9           |
| `stone-100`      | #f5f5f4           |
| `stone-200`      | #e7e5e4           |
| `stone-300`      | #d6d3d1           |
| `stone-400`      | #a8a29e           |
| `stone-500`      | #78716c           |
| `stone-600`      | #57534e           |
| `stone-700`      | #44403c           |
| `stone-800`      | #292524           |
| `stone-900`      | #1c1917           |
| `success`        | #34d399           |
| `success-light`  | #a7f3d0           |
| `success-dark`   | #059669           |
| `danger`         | #ef4444           |
| `danger-light`   | #fecaca           |
| `danger-dark`    | #b91c1c           |
| `warning`        | #f59e42           |
| `warning-light`  | #fef3c7           |
| `warning-dark`   | #b45309           |
| `info`           | #0ea5e9           |
| `info-light`     | #bae6fd           |
| `info-dark`      | #0369a1           |
| `white`          | #ffffff           |
| `black`          | #000000           |

---

> **Dica:** Para alterar o tema, basta mudar os valores no `tailwind.config.js` e recarregar o sistema. 