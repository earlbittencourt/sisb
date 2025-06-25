# Sisbic Modern

Este projeto é composto por um frontend (React) e um backend (API Node.js).

## Pré-requisitos
- Node.js (recomendado: versão 18 ou superior)
- npm ou yarn

## Instalação

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/earlbittencourt/sisb.git
   cd sisb
   ```

2. **Instale as dependências do frontend:**
   ```sh
   cd sisbic-modern
   npm install
   # ou
   yarn install
   ```

3. **Instale as dependências do backend:**
   ```sh
   cd ../sisbic-modern/server
   npm install
   # ou
   yarn install
   ```

## Rodando o Backend (API)

1. No diretório `sisbic-modern/server`, execute:
   ```sh
   npm run dev
   # ou
   yarn dev
   ```
   A API estará disponível em: http://localhost:3001

## Rodando o Frontend (React)

1. No diretório `sisbic-modern`, execute:
   ```sh
   npm start
   # ou
   yarn start
   ```
   O frontend estará disponível em: http://localhost:3000

## Observações
- Certifique-se de que o backend esteja rodando antes de acessar o frontend.
- As configurações de ambiente podem ser ajustadas nos arquivos `.env` de cada projeto.
- Para produção, utilize os scripts de build do React (`npm run build`).

## Scripts úteis
- `npm start` / `yarn start`: Inicia o frontend em modo desenvolvimento
- `npm run dev` / `yarn dev`: Inicia o backend em modo desenvolvimento
- `npm run build` / `yarn build`: Gera o build de produção do frontend

---

Se tiver dúvidas, consulte a documentação interna ou abra uma issue no repositório. 