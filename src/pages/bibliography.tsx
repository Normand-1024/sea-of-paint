import React from 'react';
import '../styles/modals.css';

const BibliographyPage: React.FC = () => {
  return (
    <div className="content-wrapper">
      <h1>References</h1>
      <p>Read our Paper on the Game <a href="https://www.mdpi.com/2076-0787/14/4/88" target="_blank">Here</a>.</p>  

      <h3>AI and Data Work</h3>

      <div style={{textAlign: "left", display: "inline-block"}}>
        Birhane, A., van Dijk, J., and Pasquale, F. 2024. <a href="https://arxiv.org/abs/2404.10072">Debunking robot rights metaphysically, ethically, and legally</a>.<br></br>

        Crawford, K. 2023. <a href="https://yalebooks.yale.edu/book/9780300264630/atlas-of-ai/" target="_blank">The Atlas of AI</a>.<br></br>

        <a href="https://data-workers.org/" target="_blank">Data Worker's Inquiry</a>。 <br></br>

        Gray, M.L., and Siddharth S. 2019.  <a href="https://ghostwork.info/" target="_blank">Ghost Work</a>. <br></br>

        Li, X. 2023. <a href="https://www.sixthtone.com/news/1014142" target="_blank">Across China, an Unseen Rural Workforce Is Shaping the Future of AI</a>. <br></br>

        徐爽, 杜雯雯. <a  href="https://mp.weixin.qq.com/s/Ipk1fJWrhdXmoewaqBaYxA" target="_blank">AI标注流水线上，被抛弃的“妈妈工人”</a>. <br></br>

        Reilly, L. 2024. <a href="https://www.cnn.com/2024/08/21/media/google-california-pay-newsrooms-journalists-content-deal/index.html" target="_blank">California AI Newsroom Deal</a>. <br></br>

        VICE News. 2019. <a href="https://www.youtube.com/watch?v=mXLeBs0fGa4&t=338s" target="_blank">Grandkids On Demand & China AI Workers</a>. <br></br>
      </div>
        {/* Birhane, Abeba, Jelle van Dijk, and Frank Pasquale. 2024. <a href="https://arxiv.org/abs/2404.10072">Debunking robot rights metaphysically, ethically, and legally</a>.<br></br>
        Crawford, Kate. 2023. <a href="https://yalebooks.yale.edu/book/9780300264630/atlas-of-ai/" target="_blank">The Atlas of AI</a>.<br></br>
        <a href="https://data-workers.org/" target="_blank">Data Worker's Inquiry</a> <br></br>
        Gray, Mary L., and Siddharth Suri. 2019.  <a href="https://ghostwork.info/" target="_blank">Ghost Work</a>. <br></br>
        Li, Xin. 2023. <a href="https://www.sixthtone.com/news/1014142" target="_blank">Across China, an Unseen Rural Workforce Is Shaping the Future of AI</a>. <br></br>
        徐爽, 杜雯雯. <a  href="https://mp.weixin.qq.com/s/Ipk1fJWrhdXmoewaqBaYxA" target="_blank">AI标注流水线上，被抛弃的“妈妈工人”</a>. <br></br>
      </p> */}

      <h3>Other Inspirations</h3>
      <p  style={{textAlign: "left"}}> 
        Caravà, Marta. 2023. <a href="https://link.springer.com/rwe/10.1007/978-3-030-93789-8_53-1">Enactive Memory</a>. <br></br>
        My Brilliant Friend <br></br>
        Her Story
      </p>

    </div>
  );
};

export default BibliographyPage;