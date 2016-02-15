# featurescape
Interactive representation and analysis of feature landscapes
___
**u4preview**: Generic UI is Live application at https://sbu-bmi.github.io/featurescape, for demo applications see below

**Fig4**: for live figure 4 click on https://sbu-bmi.github.io/featurescape/fig4.html. 
___

A number of web applications were developed to assess the feasibility of the featurescape architecture. The key design criteria is the **a)** minimization of compute cycles per usage by balancing server and client side components; **b)** a ***statistical zooming engine *** (client side) that uses a uniformly random seed index (server-side) to resolve multivariate feature spaces, and **c)** maximize the use of *** public Big Data***, such as [NCI’s TCGA](https://tcga-data.nci.nih.gov/tcgafiles/ftp_auth/distro_ftpusers/anonymous/tumor/), by client-side caching in the modern web browser NoSQL engine ([indexedDB](https://www.w3.org/TR/IndexedDB/)). 

Although the examples below demonstrate the feasibility of the proposed approach by delivering real-time navigation of large feature spaces, the more valuable deliverables are the public API’s  articulated by a HTTP REST API. These API’s are typically reproduced at the top of the user interface. 

### 1. Navigating 1.3 billion measures across 48 dimensions
live at http://sbu-bmi.github.io/featurescape/u24Preview.html

[![](http://sbu-bmi.github.io/featurescape/fun/u24preview.png)](http://sbu-bmi.github.io/featurescape/u24Preview.html)

