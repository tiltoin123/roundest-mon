import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import { useState }from 'react';
import type React from 'react';
import { inferQueryResponse } from './api/trpc/[trpc]';
import Image from 'next/image';



const btn =
  "inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

const Home: NextPage = () => {

  const [ids, updateIds] = useState(()=>getOptionsForVote());
  const [first,second]=ids;
  const firstPokemon = trpc.useQuery(["get-pokemon-by-id",{id: first}]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id",{id: second}]);
  const voteMutation = trpc.useMutation(["cast-vote"]);

  if(firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected : number) =>{
    if (selected === first){
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    }
     else {voteMutation.mutate({votedFor:second,votedAgainst:first});
    }
    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Qual é mais roliço?</div>
      <div className="p-2"/>
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
       {!firstPokemon.isLoading &&
        firstPokemon.data &&
         !secondPokemon.isLoading &&
          secondPokemon.data &&(
            <>
        <PokemonListing pokemon={firstPokemon.data} vote = {() => voteForRoundest(first)}/>
        <div className="p-8">Vs</div>
        <PokemonListing pokemon={secondPokemon.data} vote = {() => voteForRoundest(second)}/>
        </>
       )}
      
      
     <div className='p-2'></div>
     <div className="absolute bottom-0 w-full text-xl text-center pb-2">
      <a href='https://github.com/tiltoin123/roundest-mon'>Github</a>
     </div>
      </div>
    </div>
  )
}

type PokemonFromServer =inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
  }> = (props) => {
  return(

  <div className=" flex flex-col items-center">
        <Image src={props.pokemon.sprites.front_default}
          width={256} 
          height={256}
          layout="fixed"
          />
        <div className="text-xl text-center capitalize">{props.pokemon.name}</div>
        <button className={btn} onClick={() => props.vote()}>
          Roliço</button>
      </div>)
}

export default Home