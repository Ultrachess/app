/*
 * Copyright (C) 2022-2023 Ultrachess team
 * This file is part of Ultrachess - https://github.com/Ultrachess/app
 *
 * SPDX-License-Identifier: Apache-2.0
 * See the file LICENSE for more information.
 */

//current must be in seconds

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

const Badge = ({value, color}) => {

  return (
    <span
  className= {classNames(
    color === "green" ? "bg-green-100 text-green-800" : color === "blue" ? "bg-blue-100 text-blue-800" : color === "red" ? "bg-red-100 text-red-800" : color === "yellow" ? "bg-yellow-100 text-yellow-800" : color === "gray" ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800",
    "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 align-middle "
  )
  }
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="-ml-1 mr-1.5 h-4 w-4"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>

  <p className="whitespace-nowrap text-sm">{value}</p>
</span>
  )
};

export default Badge;
