"use strict";
const data = [
    {
        description: "Semana de Curso de Engenharia Informática 2026",
        dates: ["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16"],
        periods: ["09:00 - 13:00", "14:00 - 18:00"],
        tasks: [
            ["Convidados", 1],
            ["Audiovisuais", 1],
            ["Entrada", 2],
            ["Livre", 0]
        ],
        persons: ["Madalena", "Mafalda", "Manuel", "Mário", "Matilde"],
        restrictions: [
            { date: 1, person: 1 },
            { date: 2, period: 1, task: 0 }
        ]
    }
];