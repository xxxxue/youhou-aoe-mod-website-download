// ==UserScript==
// @name         给 帝国时代 mod 官网添加一个下载按钮
// @namespace    http://tampermonkey.net/
// @version      2026-10-15
// @description  我只用于帝国时代2（aoe2），这个网站的其他游戏 mod 估计也可以用（aoe3、aoe4 之类的）。点击左上角的按钮给列表中的每个项添加下载按钮，下载后的压缩包解压到 “D:\UserDir\admin\Games\Age of Empires 2 DE\76561197960271872\mods\local”，解压后每个 mod 要有一个文件夹，里面是 resources 之类的 mod 文件，可以提前改一下文件夹名称，这样游戏首次会在 info.json 中生成这个名字。
// @author       You
// @match        https://*.ageofempires.com/mods/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ageofempires.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function add_buttons() {
    // 1. 获取页面上所有的 a 标签
    const links = document.querySelectorAll("a");

    // 2. 遍历并筛选符合要求的链接
    links.forEach((link) => {
      // 检查 href 是否存在，且是否以 /mods/details/ 开头
      if (link.href && link.href.includes("/mods/details/")) {
        // 为了防止重复添加，可以检查一下是否已经添加过按钮
        if (link.getAttribute("data-alert-btn-added") === "true") return;

        // 3. 创建按钮
        const btn = document.createElement("button");
        btn.innerText = "下载";
        btn.style.marginLeft = "5px";
        btn.style.padding = "2px 6px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "12px";
        btn.style.backgroundColor = "white";
        btn.style.zIndex = 9999;

        // 4. 绑定点击事件
        btn.addEventListener("click", async (e) => {
          e.preventDefault(); // 防止点击按钮时触发链接跳转

          let url = link.href;

          let id = url
            .replaceAll("https://www.ageofempires.com/mods/details/", "")
            .replaceAll("/", "/");

          let download_url = await download(Number.parseInt(id));
          location.href = download_url;

          console.log(link.innerText, url, download_url);
          btn.innerText = download_url.replaceAll(
            "https://cdn.ageofempires.com/aoe-mods/",
            "",
          );
        });

        // 5. 将按钮插入到链接旁边
        // insertAdjacentElement('afterend', ...) 会将按钮插在 a 标签的闭合标签之后
        link.insertAdjacentElement("beforebegin", btn);

        // 标记已添加
        link.setAttribute("data-alert-btn-added", "true");

        const btn2 = document.createElement("button");
        btn2.innerText = "复制名称";
        btn2.style.marginLeft = "5px";
        btn2.style.padding = "2px 6px";
        btn2.style.cursor = "pointer";
        btn2.style.fontSize = "12px";
        btn2.style.backgroundColor = "white";
        btn2.style.zIndex = 9999;

        // 4. 绑定点击事件
        btn2.addEventListener("click", async (e) => {
          e.preventDefault(); // 防止点击按钮时触发链接跳转
          await navigator.clipboard.writeText(link.innerText.trim());
        });

        // 5. 将按钮插入到链接旁边
        link.insertAdjacentElement("beforebegin", btn2);
      }
    });
  }

  const download = (id) => {
    return new Promise((resolve, reject) => {
      fetch("https://api.ageofempires.com/api/v1/mods/Download", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, boolValue: true }),
        method: "POST",
        mode: "cors",
      })
        .then((r) => r.json())
        .then((r) => {
          let url = r.value.downloadUrl;
          resolve(url);
        })
        .catch((e) => reject(e));
    });
  };

  const btn = document.createElement("button");
  btn.innerText = "添加下载按钮";
  btn.addEventListener("click", () => {
    add_buttons();
  });
  btn.style.position = "fixed";
  btn.style.left = "0px";
  btn.style.top = "0px";
  btn.style.backgroundColor = "white";
  btn.style.zIndex = 9999;
  document.body.appendChild(btn);
})();
