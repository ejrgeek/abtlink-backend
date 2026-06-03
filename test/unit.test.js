const assert = require("node:assert/strict");
const { test } = require("node:test");

const AppError = require("../src/utils/appError");
const { getRequestInfo } = require("../src/utils/requestInfo");
const { isReservedUsername, sanitizeSlug, randomSlug } = require("../src/utils/slug");

test("sanitizeSlug deve transformar texto em url amigavel", () => {

    const slug = sanitizeSlug("Botei açúcar no café");

    assert.strictEqual(slug, "botei-acucar-no-cafe");

});

test("sanitizeSlug nao recebe valor", () => {

    const slug = sanitizeSlug("");

    assert.strictEqual(slug, "");

});

test("isResererdUsername nao deve permitir nomes reservados", () => {

    const status = isReservedUsername("api");

    assert.strictEqual(status, true);

});

test("isResererdUsername deve permitir nomes nao reservados", () => {

    const status = isReservedUsername("erlon");

    assert.strictEqual(status, false);

});

test("randomSlug deve gerar um slug aleatorio de tamanho 7", () => {

    const slug = randomSlug();

    assert.strictEqual(slug.length, 7);

});


test("randomSlug deve gerar um slug aleatorio de tamanho 10", () => {

    const slug = randomSlug(10);

    assert.strictEqual(slug.length, 10);

});


test("AppError deve guardar message e statusCode", () => {
    const error = new AppError("Acesso Negado.", 403);

    assert.strictEqual(error.message, "Acesso Negado.");
    assert.strictEqual(error.statusCode, 403);
});

test("getRequestInfo deve pegar os dados da requisicao", () => {
    const req = {
        ip: "127.0.0.1",
        headers: {
            "user-agent": "Node",
            referer: "https://algum-lugar.com.br",
        },
    };

    const info = getRequestInfo(req);

    assert.strictEqual(info.userAgent, "Node");
    assert.strictEqual(info.referer, "https://algum-lugar.com.br");
    assert.strictEqual(info.ipHash.length, 64);

});


test("getRequestInfo nao recebe ip", () => {
    const req = {
        headers: {
            "user-agent": "Node",
            referer: "https://algum-lugar.com.br",
        },
    };

    const info = getRequestInfo(req);

    assert.strictEqual(info.ipHash, null);

});

test("getRequestInfo nao recebe user-agent", () => {
    const req = {
        ip: "127.0.0.1",
        headers: {
            referer: "https://algum-lugar.com.br",
        },
    };

    const info = getRequestInfo(req);

    assert.strictEqual(info.userAgent, null);

});

test("getRequestInfo recebe referrer", () => {
    const req = {
        ip: "127.0.0.1",
        headers: {
            referrer: "https://algum-lugar.com.br",
        },
    };

    const info = getRequestInfo(req);

    assert.strictEqual(info.referer, "https://algum-lugar.com.br");

});


test("getRequestInfo nao recebe referer ou referrer", () => {
    const req = {
        ip: "127.0.0.1",
        headers: {
        },
    };

    const info = getRequestInfo(req);

    assert.strictEqual(info.referer, null);

});