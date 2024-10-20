// src/components/PokemonList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import './PokemonList.css';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  height: number;
  weight: number;
}

const PokemonList: React.FC = () => {
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
        const detailsRequests = response.data.results.map((pokemon: Pokemon) => axios.get(pokemon.url));
        const detailsResponses = await Promise.all(detailsRequests);
        setPokemonData(detailsResponses.map(res => res.data));
      } catch (error) {
        console.error("Error fetching pokemons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Height (m)</TableCell>
            <TableCell>Weight (kg)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pokemonData.map((pokemon) => (
            <TableRow key={pokemon.id}>
              <TableCell>
                <Link to={`/pokemon/${pokemon.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                  {pokemon.name}
                </Link>
              </TableCell>
              <TableCell>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: "50px", height: "50px" }} />
              </TableCell>
              <TableCell>{pokemon.height / 10} m</TableCell>
              <TableCell>{pokemon.weight / 10} kg</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PokemonList;
