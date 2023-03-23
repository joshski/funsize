import React from "react";

export async function get() {
  return { message: 'Hello World' }
}

export function html(data: Data) {
  return (<p>{data.message + '!'}</p>)
}

export function json(data: Data) {
  return { message: `${data.message}!` }
}

interface Data {
  message: string;
}
