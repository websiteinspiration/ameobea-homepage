---
title: 'Managing State in WebAssembly Web Applications'
date: '2019-04-21'
---

Building web applications with Rust and WebAssembly has never been easier. Amazing tools like [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen), [wasm-pack](https://github.com/rustwasm/wasm-pack), and others have made it just about trivial to write Rust code that compiles into WebAssembly and runs in the browser.

There are still a few challenges, however. Since Wasm apps run in the web browser, the primary way of allowing users to interact with your application is via the DOM. The gap between Wasm-world and HTML-land needs to be bridged, and that means somehow generating HTML and linking it to your Wasm code. There are some compelling options that allow you to write HTML directly from Rust/Wasm such as [yew](https://github.com/DenisKolodin/yew) and [dodrio](https://github.com/fitzgen/dodrio). The goal of these library and others like them is to create a _Virtual DOM_, allowing you to specify your application's behavior and let the library handle the minutiae of actually rendering it to the DOM, setting up input listeners, updating in response to changes, and things like that.

These Rusty virtual DOM libraries are certainly fascinating and have a lot of potential, and the idea of being able to implement your entire web app from inside of Rust is exciting to say the least. However, they're still quite far behind the power and functionality you can get from using a JavaScript-based UI framework like React. Besides that, perhaps even more compellingly, React allows you to make use of the entire massive React ecosystem of libraries, pre-built components, and utilities that have been created.

I've found what I feel is a really nice compromise when building web applications with Rust/Wasm + React. It focuses around treating the whole Javascript + React layer as "presentational," aiming to keep as much of the logic and heavy lifting as possible on the WebAssembly side. As the programmer, you're free to keep the "way it works" separated from "the way it looks" which, in my experience, greatly helps to keep the code clean and easy to understand.

The secret sauce for this method is **Redux**. If you're not familiar with it, Redux is a state management library popular with the React community. It focuses on immutable state that is updated by _actions_, with the updating logic being handled by _reducers_. Reducers are nothing more functions that take `(previousState, action) -> newState`. Here's what a typical reducer may look like:

```js
const initialState = {
  count: 0,
};

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_COUNT: {
      return { ...state, count: state.count + 1 };
    }

    default: {
      return state;
    }
  }
};
```

The nice part about this setup is that your mechanisms for dispatching application state updates are already very decoupled from both the logic that does the updating and the components that actually use the state. If you want to update your UI state from Wasm, all you need to do is call a simple function with some arguments. Updating the state, passing the updated state to UI components, and rendering the updated components is all handled outside of your application's core logic.

## Where to Keep Your State

One of the most important considerations in frontend webdev and programming in general is where to store your application's state. The way in which you manage your application's state is one of if not the largest contributor to the overall ease of programming and cohesiveness of its code. WebAssembly adds another layer on top of this since state in JavaScript isn't easily accessible from Wasm and vice versa.

There are two general patterns that you can follow to approach this problem with each one being more suited to different kinds of applications:

1. Keep your state in JavaScript, treating Wasm as an external API that you call into to do one-off computationally expensive tasks or similar things
1. Keep your state in Wasm, treating JavaScript as a rendering layer of shim between your application's logic and the DOM

When considering these two options, the tradeoffs become immediately clear as do the reasons that you might choose either one. For scientific applications where Wasm is used to implement expensive algorithms, it makes sense to go with the first approach and just call Wasm functions as you need them. If you need to pass in more data than just a few function arguments can handle, you can copy over a buffer into Wasm memory, operate on it, and then return the result.

For use cases where more real-time, interactive experiences such as complex data visualizations or games, it makes sense to keep all of your state in Wasm. Many of the DOM's abstractions such as event listener registration aren't as useful when you're rendering directly to a `canvas` or something similar.
