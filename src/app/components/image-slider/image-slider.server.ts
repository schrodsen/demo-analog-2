// src/app/pages/index.server.ts
import { PageServerLoad } from '@analogjs/router';

export const load = async ({
  params, // params/queryParams from the request
  req, // H3 Request
  res, // H3 Response handler
  fetch, // internal fetch for direct API calls,
  event, // full request event
}: PageServerLoad) => {

  console.log(req.url)
  //const productCode =
  const apiUrl = `https://vhdev.proxy.beeceptor.com/slider/kuga`;
  const response = await fetch<string>(apiUrl);

  return {
    loaded: true,
    response: response
  };
};
