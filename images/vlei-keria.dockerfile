FROM node:14 as builder

WORKDIR /app

COPY signify-ts/ ./
RUN npm install
RUN node 'node_modules/.bin/jest' '/app/examples/integration-scripts/singlesig-vlei-issuance.test.ts' -c '/app/examples/integration-scripts/jest.config.ts' -t 'singlesig-vlei-issuance'

# Stage 2: Build the final image
FROM weboftrust/keria:latest

COPY --from=builder /app /app

ENTRYPOINT ["sh", "-c"]
CMD ["keria start --config-dir /keria/config --config-file keria --name agent & sleep 10; node /app/examples/integration-scripts/singlesig-vlei-issuance.test.ts"]

