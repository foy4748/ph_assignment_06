//console.log("index.js is connected");

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
                <a class="nav-link" aria-current="page" href="#" data-category-id=${category_id}>${category_name}</a>
              </li>
		`;
    categoryNav.innerHTML += template;
  });
  categoryNav.firstElementChild.click();
}

function fetchNews(categoryId) {
  const categoryNewsURL = `https://openapi.programming-hero.com/api/news/category/${categoryId}`;
  fetchData(categoryNewsURL, renderNews);
}

function renderNews({ data }) {
  const categoryNav = document.getElementById("category-nav");
  const currentCategory = categoryNav.querySelector(
    `[data-category-id='${data[0] ? data[0].category_id : ""}']`
  );

  //Rendering number of news available to the corresponding category
  const numOfNews = document.getElementById("number-of-news");
  numOfNews.textContent = "";
  numOfNews.textContent = data.length
    ? `${data.length} news found in ${
        currentCategory ? currentCategory.textContent : ""
      }`
    : "No news found";

  //Sorting the News based on Number of Views
  //for BONUS MARKS
  const sortedData = data.sort((prev, next) => {
    if (prev.total_view > next.total_view) return -1;
  });

  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = "";
  sortedData.forEach((item) => {
    const { title, thumbnail_url, details, author, total_view } = item;
    const { img: author_img, name: author_name, published_date } = author;

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
                <article class="writings">
                  <h1>${title}</h1>
                  <p>
					${details.slice(0, 300) + " ..."}
                  </p>
                </article>

                <div
                  class="info d-md-flex justify-content-between align-items-center"
                >
                  <div class="author d-flex">
                    <div class="author-img">
                      <img
                        class="author-img"
                        src="${author_img}"
                        alt=""
                      />
                    </div>
                    <div class="author-info px-3">
                      <h5>${
                        author_name ? author_name : "No data available"
                      }</h5>
                      <p>${
                        published_date
                          ? moment(published_date).format("DD MMMM, YYYY")
                          : "No data available"
                      }</p>
                    </div>
                  </div>
                  <div class="views">
                    <h5>${
                      total_view || total_view === 0
                        ? '<i class="fa-regular fa-eye"></i>  ' +
                          total_view +
                          " views"
                        : "No data available"
                    } </h5>
                  </div>
                  <div class="modal-trigger">
					  <!-- Button trigger modal -->
					  <a
						data-bs-toggle="modal"
						data-bs-target="#newsModal"
					  >
					  <i class="fa-solid fa-circle-arrow-right"></i>
					  </a>
				  </div>
                </div>
              </div>
            </div>
	  `;
    col.innerHTML = template;
    newsContainer.append(col);
  });
}
