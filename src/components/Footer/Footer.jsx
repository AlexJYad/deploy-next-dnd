import "./Footer.css";

const FONT_CREDIT = {
   name: "Bulgaria Moderna Pro",
   author: "Yanko Tsvetkov",
   authorUrl: "https://www.alphadesigner.com",
   license: "CC BY-NC 4.0",
   licenseUrl: "https://creativecommons.org/licenses/by-nc/4.0/",
};

export default function Footer() {
   const year = new Date().getFullYear();

   return (
      <footer className="site-footer">
         <p className="site-footer__line">
            Шрифт «{FONT_CREDIT.name}» ©{" "}
            <a
               href={FONT_CREDIT.authorUrl}
               target="_blank"
               rel="noopener noreferrer"
            >
               {FONT_CREDIT.author}
            </a>
            , лицензия{" "}
            <a
               href={FONT_CREDIT.licenseUrl}
               target="_blank"
               rel="noopener noreferrer"
            >
               {FONT_CREDIT.license}
            </a>
            . Только некоммерческое использование.
         </p>
         <p className="site-footer__line site-footer__line--muted">
            © {year} D&amp;D Alex Yad. Неофициальный фанатский проект.
         </p>
      </footer>
   );
}
