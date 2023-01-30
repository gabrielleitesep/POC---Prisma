import prisma from "../src/db/db.js";

async function main() {
    await prisma.genres.createMany({
        data: [
            {
                "genre": "romance"
            },
            {
                "genre": "biografia"
            },
            {
                "genre": "curiosidades"
            },
            {
                "genre": "aventura"
            },
            {
                "genre": "piadas"
            },
            {
                "genre": "ficção"
            },
        ]
    })

    await prisma.contries.createMany({
        data: [
            {
                "contry": "Brasil"
            },
            {
                "contry": "Alemanha"
            },
            {
                "contry": "Argentina"
            },
            {
                "contry": "França"
            },
            {
                "contry": "Angola"
            },
            {
                "contry": "Inglaterra"
            },
        ]
    })
}

main()
.then(() => {console.log("Registro feito com sucesso!");})
.catch(error => {
    console.error(error);
    process.exit(1);
})
.finally(async () =>{
    await prisma.$disconnect();
})