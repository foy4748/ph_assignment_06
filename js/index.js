//console.log("index.js is connected");

/*
 * Common Fetcher Function
 *
 */

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

/*
 * Fetcher Functions
 *
 */

function fetchCategory() {
  categoryURL = "https://openapi.programming-hero.com/api/news/categories";
  fetchData(categoryURL, renderCategory);
}

//Calling fetch category
//when the page is rendering
//for first time
fetchCategory();

function fetchNews(categoryId) {
  const categoryNewsURL = `https://openapi.programming-hero.com/api/news/category/${categoryId}`;
  fetchData(categoryNewsURL, renderNews);
}

function fetchNewsDetails(news_id) {
  const newsDetailURL = `https://openapi.programming-hero.com/api/news/${news_id}`;
  fetchData(newsDetailURL, renderNewsDetailsInModal);
}

/*
 * Render Functions
 *
 */

function renderCategory({ data: { news_category } }) {
  const categoryNav = document.getElementById("category-nav");

  //Creating Category Nav Links
  news_category.forEach(({ category_id, category_name }) => {
    const template = `
              <li class="nav-item" onclick="fetchNews('${category_id}')">
                <a class="nav-link" aria-current="page" href="#" data-category-id=${category_id}>${category_name}</a>
              </li>
		`;
    categoryNav.innerHTML += template;
  });

  //The first category is active by default
  categoryNav.firstElementChild.click();
}

function renderNewsDetailsInModal({ data }) {
  const [_newsDetails] = [data];
  const newsDetails = _newsDetails[0];

  //Destructuring necessary info
  const { title, image_url, details, author, total_view } = newsDetails;
  const { img: author_img, name: author_name, published_date } = author;

  //Grabbing Modal
  const newsModal = document.getElementById("news-modal");
  const modalTitle = document.querySelector(".modal-title");

  //Creating Modal
  modalTitle.textContent = "";
  modalTitle.textContent = title;

  const template = `
	  <div class="d-flex justify-content-center modal-img">
		<img class="news-modal-img img img-fluid" src="${image_url}" alt=""/>
	  </div>

                <div
                  class="info d-md-flex justify-content-between align-items-center mt-3"
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
			  </div>



	  <div className="content">
		  <p>${details}</p>
	  </div>
	`;

  newsModal.innerHTML = "";
  newsModal.innerHTML = template;
}

function renderNews({ data }) {
  //Grabbing placeholders
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
    //Destructuring necessary info
    const {
      title,
      thumbnail_url,
      details,
      author,
      total_view,
      _id: news_id,
    } = item;
    const { img: author_img, name: author_name, published_date } = author;

    //Creating News
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
                  <div class="modal-trigger" onclick="fetchNewsDetails('${news_id}')">
					  <a data-bs-toggle="modal" data-bs-target="#newsModal" href="#">
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
