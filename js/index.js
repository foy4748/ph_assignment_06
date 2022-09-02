console.log("index.js is connected");

async function fetchData(URL, FUNC) {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    FUNC(data);
  } catch (error) {
    //Handling ERROR for BONUS MARKS
    console.log(error);
    FUNC(false);
  }
}

function fetchCategory() {
  categoryURL = "https://openapi.programming-hero.com/api/news/categories";
  fetchData(categoryURL, renderCategory);
}

fetchCategory();

function renderCategory({ data: { news_category } }) {
  const categoryNav = document.getElementById("category-nav");
  news_category.forEach(({ category_id, category_name }) => {
    const template = `
              <li class="nav-item" onclick="fetchNews('${category_id}')">
                <a class="nav-link" aria-current="page" href="#">${category_name}</a>
              </li>
		`;
    categoryNav.innerHTML += template;
  });
}

function fetchNews(categoryId) {
  const categoryNewsURL = `https://openapi.programming-hero.com/api/news/category/${categoryId}`;
  fetchData(categoryNewsURL, renderNews);
}

function renderNews({ data }) {
  //Rendering number of news available to the corresponding category
  const numOfNews = document.getElementById("number-of-news");
  numOfNews.textContent = "";
  numOfNews.textContent = data.length
    ? `${data.length} news found`
    : "No news found";

  //Sorting the News based on Number of Views
  //for BONUS MARKS
  const sortedData = data.sort((prev, next) => {
    if (prev.total_view > next.total_view) return -1;
  });

  const newsContainer = document.getElementById("news-container");
  sortedData.forEach((item) => {
    const { title, thumbnail_url, details } = item;
    const col = document.createElement("div");
    col.classList.add("col");
    const template = `
              <div class="singleNews d-md-flex">
                <div
                  class="thumbnail d-flex justify-content-center align-items-center"
                >
                  <img
                    src="${thumbnail_url}"
                  />
                </div>
                <div class="content p-5">
                  <h1>${title}</h1>
                  <p>
				  ${details.slice(0, 400) + "..."}
                  </p>
                </div>
              </div>
	  `;
    col.innerHTML = template;
    newsContainer.append(col);
  });
}
