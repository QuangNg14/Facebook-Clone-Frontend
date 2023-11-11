import React, { useContext } from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act,
  rerender,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Main from "../main/main";
import UserProfile from "../main/user";

// Mock navigate function from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

global.fetch = require("jest-fetch-mock");

const setup = () => {
  const userContextValue = [
    null,
    jest.fn(),
    [],
    jest.fn(),
    "loggedOut",
    jest.fn(),
  ];
  return {
    ...render(
      <UserContext.Provider value={userContextValue}>
        <Router>
          <Main />
          <UserProfile />
        </Router>
      </UserContext.Provider>
    ),
  };
};

describe("Fetch Articles", () => {
  beforeEach(() => {
    let testUserBret = {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496",
        },
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
    };
    localStorage.setItem("loginState", "loggedIn");
    localStorage.setItem("loginUser", JSON.stringify(testUserBret));
  });
  afterEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  it("should fetch all articles for current logged in user", async () => {
    const mockUserResponse = {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496",
        },
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
    };

    const mockPostsResponse = [
      {
        userId: 1,
        title: "Article 1",
        body: "Body of article 1",
      },
      {
        userId: 1,
        title: "Article 2",
        body: "Body of article 2",
      },
    ];

    global.fetch = jest.fn((url) => {
      if (url.includes("users")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockUserResponse),
        });
      }
      if (url.includes("posts")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPostsResponse),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    await act(async () => {
      setup();
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    await waitFor(async () => {
      const articlesFeed = screen.getByTestId("articles-feed");
      console.log("Articles Feed:", articlesFeed.innerHTML);
    });

    const article1 = await screen.findByText(/Article 1/);
    expect(article1).toBeInTheDocument();

    const article2 = await screen.findByText(/Article 2/);
    expect(article2).toBeInTheDocument();
  });

  it("should fetch subset of articles for current logged in user given search keyword", async () => {
    const mockUserResponse = {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz",
      address: {
        street: "Kulas Light",
        suite: "Apt. 556",
        city: "Gwenborough",
        zipcode: "92998-3874",
        geo: {
          lat: "-37.3159",
          lng: "81.1496",
        },
      },
      phone: "1-770-736-8031 x56442",
      website: "hildegard.org",
      company: {
        name: "Romaguera-Crona",
        catchPhrase: "Multi-layered client-server neural-net",
        bs: "harness real-time e-markets",
      },
    };

    const mockPostsResponse = [
      {
        userId: 1,
        title: "Article 1",
        body: "Body of post 1",
      },
      {
        userId: 1,
        title: "Article 2",
        body: "Body of post 2",
      },
    ];

    global.fetch = jest.fn((url) => {
      if (url.includes("users")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockUserResponse),
        });
      }
      if (url.includes("posts")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPostsResponse),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    await act(async () => {
      setup();
    });

    fireEvent.change(screen.getByTestId("search-article"), {
      target: { value: "1" },
    });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    await waitFor(async () => {
      const articlesFeed = screen.getByTestId("articles-feed");
      console.log("Articles Feed:", articlesFeed.innerHTML);
    });

    // Wait for the articles to update based on the search term
    const article1 = await screen.findByText(/Article 1/);
    expect(article1).toBeInTheDocument();

    // Check if only the article that matches the search keyword is in the document
    const article2 = screen.queryByText(/Article 2/);
    expect(article2).not.toBeInTheDocument();
  });

  it("should add articles when adding a follower", async () => {
    const mockUserResponse = {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv",
      address: {
        street: "Victor Plains",
        suite: "Suite 879",
        city: "Wisokyburgh",
        zipcode: "90566-7771",
        geo: {
          lat: "-43.9509",
          lng: "-34.4618",
        },
      },
      phone: "010-692-6593 x09125",
      website: "anastasia.net",
      company: {
        name: "Deckow-Crist",
        catchPhrase: "Proactive didactic contingency",
        bs: "synergize scalable supply-chains",
      },
    };

    const mockPostsResponse = [
      {
        userId: 2,
        id: 11,
        title: "et ea vero quia laudantium autem",
        body: "delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus\naccusamus in eum beatae sit\nvel qui neque voluptates ut commodi qui incidunt\nut animi commodi",
      },
      {
        userId: 2,
        id: 12,
        title: "in quibusdam tempore odit est dolorem",
        body: "itaque id aut magnam\npraesentium quia et ea odit et ea voluptas et\nsapiente quia nihil amet occaecati quia id voluptatem\nincidunt ea est distinctio odio",
      },
      {
        userId: 2,
        id: 13,
        title: "dolorum ut in voluptas mollitia et saepe quo animi",
        body: "aut dicta possimus sint mollitia voluptas commodi quo doloremque\niste corrupti reiciendis voluptatem eius rerum\nsit cumque quod eligendi laborum minima\nperferendis recusandae assumenda consectetur porro architecto ipsum ipsam",
      },
      {
        userId: 2,
        id: 14,
        title: "voluptatem eligendi optio",
        body: "fuga et accusamus dolorum perferendis illo voluptas\nnon doloremque neque facere\nad qui dolorum molestiae beatae\nsed aut voluptas totam sit illum",
      },
      {
        userId: 2,
        id: 15,
        title: "eveniet quod temporibus",
        body: "reprehenderit quos placeat\nvelit minima officia dolores impedit repudiandae molestiae nam\nvoluptas recusandae quis delectus\nofficiis harum fugiat vitae",
      },
      {
        userId: 2,
        id: 16,
        title:
          "sint suscipit perspiciatis velit dolorum rerum ipsa laboriosam odio",
        body: "suscipit nam nisi quo aperiam aut\nasperiores eos fugit maiores voluptatibus quia\nvoluptatem quis ullam qui in alias quia est\nconsequatur magni mollitia accusamus ea nisi voluptate dicta",
      },
      {
        userId: 2,
        id: 17,
        title: "fugit voluptas sed molestias voluptatem provident",
        body: "eos voluptas et aut odit natus earum\naspernatur fuga molestiae ullam\ndeserunt ratione qui eos\nqui nihil ratione nemo velit ut aut id quo",
      },
      {
        userId: 2,
        id: 18,
        title: "voluptate et itaque vero tempora molestiae",
        body: "eveniet quo quis\nlaborum totam consequatur non dolor\nut et est repudiandae\nest voluptatem vel debitis et magnam",
      },
      {
        userId: 2,
        id: 19,
        title: "adipisci placeat illum aut reiciendis qui",
        body: "illum quis cupiditate provident sit magnam\nea sed aut omnis\nveniam maiores ullam consequatur atque\nadipisci quo iste expedita sit quos voluptas",
      },
      {
        userId: 2,
        id: 20,
        title: "doloribus ad provident suscipit at",
        body: "qui consequuntur ducimus possimus quisquam amet similique\nsuscipit porro ipsam amet\neos veritatis officiis exercitationem vel fugit aut necessitatibus totam\nomnis rerum consequatur expedita quidem cumque explicabo",
      },
    ];

    global.fetch = jest.fn((url) => {
      if (url.includes("users")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockUserResponse),
        });
      }
      if (url.includes("posts")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPostsResponse),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
    await act(async () => {
      setup();
    });

    fireEvent.change(screen.getByTestId("follow-user"), {
      target: { value: 3 },
    });

    fireEvent.click(screen.getByTestId("follow-user-button"));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));

    await waitFor(() => {
      const articlesFeed = screen.getByTestId("articles-feed");
      expect(articlesFeed).toBeInTheDocument();
    });

    // Wait for an article to appear
    await waitFor(() => {
      const articlePost = screen.getByTestId("article-post");
      expect(articlePost).toBeInTheDocument();
    });

    await waitFor(async () => {
      const articlesFeed = screen.getByTestId("articles-feed");
      console.log("Articles Feed:", articlesFeed.innerHTML);
    });

    const articles = await screen.findAllByTestId("article-post");
    expect(articles.length).toBe(10);
  });

  it("should remove articles when unfollow a follower", async () => {
    const mockUserResponse = {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv",
      address: {
        street: "Victor Plains",
        suite: "Suite 879",
        city: "Wisokyburgh",
        zipcode: "90566-7771",
        geo: {
          lat: "-43.9509",
          lng: "-34.4618",
        },
      },
      phone: "010-692-6593 x09125",
      website: "anastasia.net",
      company: {
        name: "Deckow-Crist",
        catchPhrase: "Proactive didactic contingency",
        bs: "synergize scalable supply-chains",
      },
    };

    const mockPostsResponse = [
      {
        userId: 2,
        id: 11,
        title: "et ea vero quia laudantium autem",
        body: "delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus\naccusamus in eum beatae sit\nvel qui neque voluptates ut commodi qui incidunt\nut animi commodi",
      },
      {
        userId: 2,
        id: 12,
        title: "in quibusdam tempore odit est dolorem",
        body: "itaque id aut magnam\npraesentium quia et ea odit et ea voluptas et\nsapiente quia nihil amet occaecati quia id voluptatem\nincidunt ea est distinctio odio",
      },
      {
        userId: 2,
        id: 13,
        title: "dolorum ut in voluptas mollitia et saepe quo animi",
        body: "aut dicta possimus sint mollitia voluptas commodi quo doloremque\niste corrupti reiciendis voluptatem eius rerum\nsit cumque quod eligendi laborum minima\nperferendis recusandae assumenda consectetur porro architecto ipsum ipsam",
      },
      {
        userId: 2,
        id: 14,
        title: "voluptatem eligendi optio",
        body: "fuga et accusamus dolorum perferendis illo voluptas\nnon doloremque neque facere\nad qui dolorum molestiae beatae\nsed aut voluptas totam sit illum",
      },
      {
        userId: 2,
        id: 15,
        title: "eveniet quod temporibus",
        body: "reprehenderit quos placeat\nvelit minima officia dolores impedit repudiandae molestiae nam\nvoluptas recusandae quis delectus\nofficiis harum fugiat vitae",
      },
      {
        userId: 2,
        id: 16,
        title:
          "sint suscipit perspiciatis velit dolorum rerum ipsa laboriosam odio",
        body: "suscipit nam nisi quo aperiam aut\nasperiores eos fugit maiores voluptatibus quia\nvoluptatem quis ullam qui in alias quia est\nconsequatur magni mollitia accusamus ea nisi voluptate dicta",
      },
      {
        userId: 2,
        id: 17,
        title: "fugit voluptas sed molestias voluptatem provident",
        body: "eos voluptas et aut odit natus earum\naspernatur fuga molestiae ullam\ndeserunt ratione qui eos\nqui nihil ratione nemo velit ut aut id quo",
      },
      {
        userId: 2,
        id: 18,
        title: "voluptate et itaque vero tempora molestiae",
        body: "eveniet quo quis\nlaborum totam consequatur non dolor\nut et est repudiandae\nest voluptatem vel debitis et magnam",
      },
      {
        userId: 2,
        id: 19,
        title: "adipisci placeat illum aut reiciendis qui",
        body: "illum quis cupiditate provident sit magnam\nea sed aut omnis\nveniam maiores ullam consequatur atque\nadipisci quo iste expedita sit quos voluptas",
      },
      {
        userId: 2,
        id: 20,
        title: "doloribus ad provident suscipit at",
        body: "qui consequuntur ducimus possimus quisquam amet similique\nsuscipit porro ipsam amet\neos veritatis officiis exercitationem vel fugit aut necessitatibus totam\nomnis rerum consequatur expedita quidem cumque explicabo",
      },
    ];

    global.fetch = jest.fn((url) => {
      if (url.includes("users")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockUserResponse),
        });
      }
      if (url.includes("posts")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPostsResponse),
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });
    await act(async () => {
      setup();
    });

    fireEvent.change(screen.getByTestId("follow-user"), {
      target: { value: 3 },
    });

    fireEvent.click(screen.getByTestId("follow-user-button"));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));

    await waitFor(() => {
      const articlesFeed = screen.getByTestId("articles-feed");
      expect(articlesFeed).toBeInTheDocument();
    });

    // Wait for an article to appear
    await waitFor(() => {
      const articlePost = screen.getByTestId("article-post");
      expect(articlePost).toBeInTheDocument();
    });

    const initialArticles = await screen.findAllByTestId("article-post");

    fireEvent.click(screen.getByTestId("unfollow-user-button"));

    await waitFor(async () => {
      const articlesFeed = screen.getByTestId("articles-feed");
      console.log("Articles Feed:", articlesFeed.innerHTML);
    });

    let finalArticles;
    try {
      finalArticles = await screen.findAllByTestId("article-post");
    } catch (error) {
      console.error("Final articles not found:", error);
      finalArticles = [];
    }

    // Check if the number of articles has decreased
    if (!initialArticles || !finalArticles) {
      throw new Error("Could not compare initial and final articles");
    }

    const numInitialArticles = initialArticles.length;
    const numFinalArticles = finalArticles.length;
    expect(numFinalArticles).toBeLessThan(numInitialArticles);
  });
});
