"use strict";

/**
 * Classe PlannedEvent
 * @class Objetos que representam eventos, permitindo gerir as suas datas, períodos, tarefas, pessoas e restrições.
 */
class PlannedEvent {
    #description;
    #dates;
    #periods;
    #tasks;
    #persons;
    #restrictions;

    /**
     * @constructs PlannedEvent
     * @param {string} description - Descrição do evento.
     */
    constructor(description) {
        this.#description = description;
        this.#dates = [];
        this.#periods = [];
        this.#tasks = [];
        this.#persons = [];
        this.#restrictions = [];
    }

    /**
     * Obtém a designação do evento.
     * @returns {string} Designação do evento.
     */
    get description() {
        return this.#description;
    }

    /**
     * Altera a designação do evento.
     * @param {string} value - Nova designação do evento.
     */
    set description(value) {
        if (typeof value !== "string" || value.trim() === "") {
            throw new Error("A descrição do evento não pode estar vazia.");
        }

        this.#description = value.trim();
    }

    /**
     * Obtém as datas associadas ao evento.
     * @returns {string[]} Lista das datas do evento.
     */
    get dates() {
        return [...this.#dates];
    }

    /**
     * Adiciona uma data ao evento, caso ainda não exista.
     * @param {string} date - Data a adicionar ao evento.
     * @returns {boolean} true se a data foi adicionada, false se já existia.
     */
    addDate(date) {
        if (this.#dates.includes(date)) {
            return false;
        }

        this.#dates.push(date);
        return true;
    }
}
