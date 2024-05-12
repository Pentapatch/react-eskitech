import { Typography } from "@mui/material";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Typography variant="h4" gutterBottom>
        Om showcase-applikationen
      </Typography>
      <Typography className="mb-4">
        Syftet med denna demo-applikation är att exemplifiera hur partners kan
        hämta information från vår produktdatabas samt hur interna användare
        inom företaget kan dra nytta av CRUD-funktionalitet för att hantera
        produktrelaterade data effektivt.
      </Typography>
    </main>
  );
}
