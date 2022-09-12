import * as trpc from '@trpc/server';
import { resolveHref } from 'next/dist/shared/lib/router/router';
import { z } from 'zod';
import {PokemonClient} from 'pokenode-ts';
import { resolve } from 'path';
import {prisma} from "@/backend/router/utils/prisma";

/*export const appRouter = trpc
  .router()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      };
    },
  });})*/

export const appRouter = trpc.router().query("get-pokemon-by-id", {
  input: z.object({ id: z.number() }),
  async resolve({input}){
    const pokeApiConnection = new PokemonClient();

    const pokemon =await pokeApiConnection.getPokemonById(input.id);
    return {name :pokemon.name, sprites:pokemon.sprites};
  }
  }).mutation("cast-vote",{
    input: z.object({
      votedFor: z.number(),
      votedAgainst: z.number(),
    }),
    async resolve(input){
      const voteInDb = await prisma.vote.create({
        data:{
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        }
      });
      return {sucess:true, vote: voteInDb};
    },
  })


// export type definition of API
export type AppRouter = typeof appRouter;
