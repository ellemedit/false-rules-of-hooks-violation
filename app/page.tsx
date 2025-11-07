"use client";

import { useOptimistic, useState, useTransition } from "react";

export default function Home() {
  const [items, setItems] = useState(["a", "b", "c"]);
  const [optimisticItems, setOptimisticItems] = useOptimistic(items);

  return (
    <div>
      <ul>
        {optimisticItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <SomeErrorTrigger isPending={items !== optimisticItems} />
      <Test
        optimisticAdd={(item) => {
          setOptimisticItems((currentItems) => [...currentItems, item]);
        }}
        addItem={(item) => {
          setItems((currentItems) => [...currentItems, item]);
        }}
      />
    </div>
  );
}

function SomeErrorTrigger({ isPending }: { isPending: boolean }) {
  if (isPending) {
    throw new Error("Some error");
  }
  return null;
}

export function Test({
  optimisticAdd,
  addItem,
}: {
  optimisticAdd: (item: string) => void;
  addItem: (item: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const random = crypto.randomUUID();
          optimisticAdd(random);
          await new Promise((resolve) => setTimeout(resolve, 100));
          startTransition(() => {
            addItem(random);
          });
        });
      }}
    >
      <button>test</button>
      {isPending && <p>Loading...</p>}
    </form>
  );
}
