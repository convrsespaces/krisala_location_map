import React from "react";
import { motion } from "framer-motion";
import LandmarkIconsHyd, { LandmarkIcon, landmarkIconsHyd } from "../icons/LandmarkIconsHyd";
import CustomTooltip from "@/components/atoms/CustomTooltip";

const COLORS = {
  background: "#0F172A",
  backgroundOpacity: "0.95",
  text: "#F8FAFC",
  routeStroke: "white",
  building: "#e2e8f0",
};

const STROKE_WIDTHS = {
  default: "5",
  thin: "3",
};

const DEFAULT_IMAGE = "/landmarks/gar.webp";

interface LandmarkProps {
  id: string;
  path: string;
  strokeWidth?: string;
  delay?: number;
}

interface LandmarkDetailsProps {
  icon: React.ReactNode;
  distance: string;
  time: string;
  landmark_name: string;
  details: string;
  img?: string;
}

interface LandmarkIconProps {
  id: string;
  x: number;
  y: number;
  name: string;
  buildingPaths?: string[];
}

interface AnimatedLandmarkIconProps {
  landmarkKey: string;
  delay?: number;
}

const AnimatedLandmarkIcon: React.FC<AnimatedLandmarkIconProps> = ({ 
  landmarkKey, 
  delay = 0 
}) => {
  const landmarkData = landmarkIconsHyd[landmarkKey];
  const tooltipContent = landmarkData?.label || landmarkKey;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.9,
        delay: delay,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05 }}
      style={{ transformOrigin: "center" }}
    >
      <CustomTooltip content={tooltipContent} placement="top">
        <g style={{ pointerEvents: "all", cursor: "pointer" }}>
          <LandmarkIcon landmarkKey={landmarkKey} />
        </g>
      </CustomTooltip>
    </motion.g>
  );
};

const createLandmark = ({
  id,
  path,
  strokeWidth = STROKE_WIDTHS.default,
  delay = 0,
}: LandmarkProps) => (
  <motion.path
    id={`__route ${id}`}
    d={path}
    stroke={COLORS.routeStroke}
    strokeWidth={strokeWidth}
    fill="none"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    exit={{ pathLength: 0, opacity: 0 }}
    transition={{
      pathLength: { duration: 1.2, delay: delay + 0.8, ease: "easeInOut" },
      opacity: { duration: 1.2, delay: delay + 0.8, ease: "easeOut" }
    }}
  />
);

const createLandmarkDetails = ({
  icon,
  distance,
  time,
  landmark_name,
  details,
  img,
}: LandmarkDetailsProps) => ({
  icon,
  distance,
  time,
  landmark_name,
  details,
  img: img || DEFAULT_IMAGE,
});

export const LandmarkLandmark = {
  sumadhuraHorizon: {
    icon: <AnimatedLandmarkIcon landmarkKey="sumadhuraHorizon" delay={0}/>,
    route: createLandmark({
      id: "__route sumadhura horizon",
      path: "M640.5 389.5L647.58 395.252C648.061 395.643 648.074 396.373 647.608 396.781L641.141 402.439C640.771 402.763 640.691 403.306 640.951 403.722L643 407L644.939 410.878C644.979 410.959 645.031 411.034 645.092 411.101L654.5 421.5L664 430L676.5 440L687.343 447.886C687.447 447.961 687.564 448.016 687.688 448.047L689.394 448.473C689.464 448.491 689.533 448.516 689.598 448.549L695.415 451.458C695.472 451.486 695.525 451.519 695.575 451.558L703.093 457.306C703.573 457.674 703.62 458.38 703.192 458.808L701.115 460.885C701.039 460.961 700.975 461.049 700.927 461.145L694.546 473.908C694.515 473.969 694.491 474.033 694.474 474.099L688 498.5L677.727 552.312C677.609 552.929 678.081 553.5 678.709 553.5H684.5",
      delay: 0,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.sumadhuraHorizon,
      distance: "10.2 km",
      time: "30 min",
      landmark_name: "Sumadhura Horizon",
      details:
        "Sumadhura Horizon is a premier gated community in Gachibowli, Hyderabad, offering modern living with excellent connectivity.",
      img: "/landmarks/horizon.webp",
    }),
  },
  sumadhuraAcropolis: {
    icon: <AnimatedLandmarkIcon landmarkKey="sumadhuraAcropolis" delay={0.5}/>,
    route: createLandmark({
      id: "__route sumadhura acropolis",
      path: "M673 494V496.069C673 496.594 673.405 497.029 673.929 497.066L686.802 497.986C686.933 497.995 687.06 498.03 687.178 498.089L687.283 498.141C687.702 498.351 687.919 498.824 687.805 499.278L687.5 500.5L677.724 552.315C677.607 552.93 678.08 553.5 678.706 553.5H684.5",
      delay: 0,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.sumadhuraAcropolis,
      distance: "3.5 km",
      time: "17 min",
      landmark_name: "Sumadhura Acropolis",
      details:
        "Sumadhura Acropolis is a premier gated community in Gachibowli, Hyderabad, offering modern living with excellent connectivity.",
      img: "/landmarks/acropolis.webp",
    }),
  },
  cyberTowers: {
    icon: <AnimatedLandmarkIcon landmarkKey="cyberTowers" delay={1.0}/>,
    route: createLandmark({
      id: "__route cyber towers ",
      path: "M747 429H742.221C741.79 429 741.408 429.275 741.272 429.684L739.551 434.846C739.517 434.948 739.467 435.044 739.403 435.13L736.7 438.733C736.57 438.906 736.5 439.117 736.5 439.333V456.086C736.5 456.351 736.395 456.605 736.207 456.793L731.607 461.393C731.258 461.742 730.706 461.785 730.308 461.493L723.605 456.577C723.535 456.526 723.459 456.484 723.378 456.452L712.632 452.247C712.251 452.098 711.816 452.197 711.537 452.496L705.579 458.879C705.245 459.237 704.701 459.301 704.294 459.029L704.182 458.955C703.785 458.69 703.257 458.743 702.92 459.08L701.115 460.885C701.039 460.961 700.975 461.049 700.927 461.145L694.546 473.907C694.516 473.969 694.491 474.034 694.474 474.1L687 502.5L677.72 552.317C677.606 552.932 678.078 553.5 678.703 553.5H684.5",
      delay: 1.0,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.cyberTowers,
      distance: "11.9 km",
      time: "22 min",
      landmark_name: "Cyber Towers",
      details:
        "Cyber Towers is a landmark IT park located in HITEC City, Hyderabad, known for its iconic architecture and tech companies.",
      img: "/landmarks/cyber-towers.webp",
    }),
  },
  sumadhuraGardensByTheBrook: {
    icon: <AnimatedLandmarkIcon landmarkKey="sumadhuraGardensByTheBrook" delay={1.5}/>,
    route: createLandmark({
      id: "__route  sumadhura's gardens by the brook",
      path: "M827.5 849H822.026C821.697 849 821.389 849.162 821.202 849.433L816.052 856.924C816.017 856.975 815.978 857.022 815.935 857.065L809.5 863.5V863.5C809.524 863.476 809.495 863.437 809.465 863.453C807.36 864.58 805.809 865.195 802.232 865.951C802.081 865.983 801.937 866.05 801.815 866.146L792.595 873.425C792.532 873.475 792.475 873.532 792.426 873.596L782 887L767 901.5L759.08 908.43C759.027 908.477 758.969 908.517 758.907 908.552L754.666 910.908C754.556 910.969 754.459 911.05 754.379 911.146L747.5 919.5L738.497 933.454C738.068 934.12 737.07 934.045 736.745 933.322L733.067 925.149C733.023 925.05 732.995 924.945 732.984 924.838L732.017 915.173C732.006 915.059 732.014 914.943 732.042 914.831L733.5 909L741.5 886.5L744.469 880.068C744.489 880.023 744.507 879.976 744.521 879.928L748.968 864.611C748.989 864.537 749.002 864.461 749.006 864.385L749.992 845.643C749.997 845.548 749.989 845.453 749.967 845.361L742 811.5L735 779.5L731.024 747.194C731.008 747.066 730.968 746.942 730.905 746.829L689.5 672.5L680 652.5L669.5 624L668.054 618.217C668.018 618.074 668.015 617.925 668.043 617.781L674 587.5L675.973 575.664C675.991 575.556 675.991 575.444 675.973 575.336L675.523 572.638C675.508 572.546 675.48 572.458 675.44 572.374L671.208 563.44C671.077 563.162 671.08 562.839 671.218 562.565L671.441 562.118C671.48 562.04 671.53 561.967 671.588 561.901L675.412 557.599C675.47 557.533 675.52 557.46 675.559 557.382L676.724 555.053C676.893 554.714 677.239 554.5 677.618 554.5H684.5",
      delay: 1.5,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.sumadhuraGardensByTheBrook,
      distance: "19.9 km",
      time: "29 min",
      landmark_name: "Sumadhura's Gardens by the Brook",
      details:
        "A luxury residential enclave located in Kondapur, offering greenery, amenities, and connectivity.",
      img: "/landmarks/garden-brook.webp",
    }),
  },
  theOlympus: {
    icon: <AnimatedLandmarkIcon landmarkKey="theOlympus" delay={2.0}/>,
    route: createLandmark({
      id: "__route the olympus",
      path: "M654 494L673.5 497L686.879 497.923C687.476 497.964 687.903 498.516 687.793 499.105L677.722 552.816C677.607 553.431 678.079 554 678.705 554H684",
      delay: 2.0,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.theOlympus,
      distance: "3.1 km",
      time: "7 min",
      landmark_name: "The Olympus",
      details:
        "The Olympus is a premium residential project in Financial District, Hyderabad, offering elegant homes close to major tech hubs.",
      img: "/landmarks/olympus.webp",
    }),
  },
  ramojiFilmCity_d_60_58: {
    icon: <AnimatedLandmarkIcon landmarkKey="ramojiFilmCity_d_60_58" delay={2.5}/>,
    route: createLandmark({
      id: "__landmark Ramoji Film City _d_60_58",
      path: "M1461 867.5L1447 863.5L1426.58 854.535C1426.53 854.512 1426.48 854.484 1426.43 854.452L1400.6 837.234C1400.05 836.866 1399.3 837.128 1399.09 837.76L1395.07 850.281C1395.02 850.425 1394.95 850.557 1394.84 850.666L1373.5 873L1345 898L1307.57 929.939C1307.52 929.98 1307.47 930.016 1307.42 930.046L1173.08 1006.96C1173.03 1006.99 1172.97 1007.01 1172.92 1007.03L1107.57 1030.47C1107.52 1030.49 1107.47 1030.5 1107.42 1030.51L1040 1043.5L984.075 1051.99C984.025 1052 983.975 1052 983.925 1052H875H782.5C774.131 1051.89 770.197 1049.77 763.594 1045.07C763.532 1045.02 763.474 1044.97 763.424 1044.91C754.191 1034.45 750.896 1027.17 747.531 1012.14C747.511 1012.05 747.503 1011.95 747.508 1011.86L749.994 969.096C749.998 969.032 749.996 968.968 749.987 968.904L747.529 950.718C747.51 950.574 747.46 950.437 747.382 950.315L737.045 934.071C737.015 934.024 736.989 933.974 736.967 933.922L733.057 924.636C733.019 924.546 732.995 924.45 732.985 924.353L732.022 915.213C732.008 915.073 732.023 914.931 732.067 914.797L742 884.5L748.947 865.643C748.982 865.548 749.003 865.449 749.008 865.348L749.993 845.641C749.998 845.547 749.989 845.454 749.968 845.363L740.5 805L735.5 780.5L731.026 747.192C731.009 747.065 730.967 746.943 730.904 746.831L689.5 674L669.541 625.6C669.514 625.534 669.494 625.464 669.481 625.393L668.032 617.181C668.011 617.061 668.012 616.939 668.034 616.82L675.944 575.295C675.98 575.102 675.96 574.904 675.885 574.723L671.231 563.554C671.089 563.213 671.146 562.822 671.38 562.536L675.5 557.5L677.706 553.97C677.889 553.678 678.209 553.5 678.554 553.5H683.5",
      delay: 2.5,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.ramojiFilmCity_d_60_58,
      distance: "60 km",
      time: "58 min",
      landmark_name: "Ramoji Film City",
      details:
        "Ramoji Film City is the world's largest film studio complex, spread across 2000 acres. It offers a unique blend of entertainment, hospitality, and film production facilities.",
      img: "/landmarks/ramoji.webp",
    }),
  },
  nehruZoologicalPark_d_25_40: {
    icon: <AnimatedLandmarkIcon landmarkKey="nehruZoologicalPark_d_25_40" delay={3.0}/>,
    route: createLandmark({
      id: "__landmark Nehru Zoological Park _d_25_40",
      path: "M914 681L916.371 681.339C916.969 681.424 917.355 682.016 917.192 682.598L914.023 693.919C914.008 693.973 913.997 694.028 913.991 694.084L913.013 703.377C913.004 703.459 913.006 703.541 913.018 703.623L913.99 710.43C913.997 710.476 914 710.524 914 710.571V713.197C914 713.395 913.942 713.588 913.832 713.752L913.077 714.885C913.026 714.961 912.965 715.03 912.895 715.09L909.658 717.865C909.554 717.954 909.432 718.021 909.301 718.061L903.095 719.971C903.032 719.99 902.967 720.003 902.901 720.01L893.29 720.971C893.1 720.99 892.921 721.062 892.771 721.18L886.091 726.429C886.03 726.476 885.976 726.53 885.928 726.59L880.046 733.943C880.015 733.981 879.988 734.021 879.963 734.063L873.063 745.892C873.021 745.964 872.988 746.041 872.966 746.121L871.108 752.62C871.039 752.864 870.879 753.073 870.661 753.203L866 756L858.584 761.933C858.528 761.978 858.477 762.028 858.432 762.083L852.079 769.903C852.027 769.967 851.982 770.038 851.947 770.114L849 776.5L837 816.5L832.042 832.862C832.014 832.954 831.973 833.041 831.921 833.121L821.5 849L815.549 857.43C815.517 857.477 815.48 857.52 815.439 857.561L809.61 863.39C809.537 863.463 809.452 863.525 809.361 863.572C806.539 865.02 804.935 865.454 802.248 865.954C802.085 865.984 801.932 866.054 801.803 866.157L792.094 873.925C792.032 873.975 791.975 874.032 791.926 874.096L782.05 886.935C782.017 886.978 781.98 887.019 781.94 887.056L758.59 908.916C758.53 908.972 758.464 909.02 758.392 909.06L754.169 911.406C754.057 911.468 753.959 911.551 753.878 911.65L747.5 919.5L738.648 933.269C738.551 933.42 738.415 933.542 738.254 933.623L737.947 933.776C737.666 933.917 737.334 933.917 737.053 933.776L736.835 933.667C736.619 933.559 736.449 933.377 736.357 933.154L733.056 925.135C733.019 925.046 732.995 924.951 732.985 924.854L732.021 915.21C732.007 915.072 732.022 914.932 732.066 914.799L741.5 886L744.5 879.5L748.966 864.615C748.988 864.539 749.002 864.46 749.006 864.38L749.993 845.639C749.998 845.547 749.99 845.454 749.969 845.364L735.5 782L731.025 747.191C731.008 747.065 730.968 746.943 730.907 746.832L689 671.5L679.5 651L669.526 624.57C669.509 624.523 669.495 624.475 669.484 624.427L668.043 617.703C668.015 617.569 668.014 617.431 668.041 617.297L674.5 585L675.975 575.66C675.991 575.554 675.991 575.446 675.973 575.34L675.523 572.636C675.508 572.546 675.48 572.458 675.441 572.375L671.5 564L671.224 563.947C671.083 563.666 671.083 563.334 671.224 563.053L671.441 562.618C671.48 562.54 671.53 562.467 671.588 562.401L675.431 558.078C675.477 558.026 675.517 557.97 675.552 557.91L677.111 555.181C677.339 554.781 677.811 554.589 678.254 554.715L684.5 556.5",
      delay: 3.0,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.nehruZoologicalPark_d_25_40,
      distance: "25 km",
      time: "40 min",
      landmark_name: "Nehru Zoological Park",
      details:
        "Nehru Zoological Park (also known as Zoo Park) is a zoo located near Mir Alam Tank in Bahadurpura, Telangana, India. It is one of the most visited destinations in Hyderabad.",
      img: "/landmarks/zoo.webp",
    }),
  },
  tajFalaknumaPlace: {
    icon: <AnimatedLandmarkIcon landmarkKey="tajFalaknumaPlace_d_25_42" delay={3.5}/>,
    route: createLandmark({
      id: "__route  taj falaknuma place",
      path: "M954.5 731H960.642C961.136 731 961.555 731.36 961.63 731.848L962.426 737.02C962.473 737.323 962.378 737.631 962.168 737.855L948.11 752.882C948.037 752.96 947.952 753.026 947.859 753.077L942.603 755.944C942.534 755.981 942.462 756.01 942.387 756.031L937.094 757.474C937.032 757.491 936.967 757.502 936.902 757.507L930.085 757.994C930.029 757.998 929.971 757.997 929.915 757.991L925 757.5L914.593 755.518C914.531 755.506 914.471 755.488 914.412 755.465L893 747C893 747 890.244 745.554 888.5 746C887.705 746.203 886.757 746.893 886.289 747.262C886.1 747.412 885.867 747.5 885.625 747.5H883L877.081 747.007C877.027 747.002 876.974 746.993 876.921 746.98L873.938 746.235C873.415 746.104 872.882 746.411 872.734 746.93L871.108 752.62C871.039 752.864 870.879 753.073 870.661 753.203L866 756L858.584 761.933C858.528 761.978 858.477 762.028 858.432 762.083L852.088 769.892C852.03 769.964 851.981 770.043 851.945 770.128L849 777C838.238 809.971 833 830.5 832 832.5C831 834.5 821.5 849.5 821.5 849.5L815.563 857.91C815.521 857.97 815.473 858.025 815.419 858.074L810.055 862.95C810.018 862.983 809.978 863.014 809.937 863.042C806.864 865.085 805.217 865.478 802.261 865.958C802.09 865.986 801.929 866.057 801.794 866.165L792.101 873.919C792.034 873.973 791.974 874.035 791.923 874.104L782.058 887.422C782.019 887.474 781.976 887.522 781.928 887.565L759.074 908.432C759.025 908.477 758.971 908.517 758.914 908.552L754.148 911.411C754.05 911.47 753.963 911.545 753.89 911.633L747.046 919.945C747.015 919.981 746.988 920.02 746.963 920.061L738.65 933.754C738.552 933.915 738.411 934.045 738.242 934.129L737.947 934.276C737.666 934.417 737.334 934.417 737.053 934.276L736.835 934.167C736.619 934.059 736.449 933.877 736.357 933.654L733.056 925.635C733.019 925.546 732.995 925.451 732.985 925.354L732.021 915.71C732.007 915.572 732.022 915.432 732.066 915.299L741.5 886.5L744.5 879.5L748.963 865.119C748.988 865.04 749.002 864.958 749.007 864.875L749.993 846.139C749.998 846.047 749.99 845.954 749.969 845.864L735.5 782.5L731.025 747.691C731.008 747.565 730.968 747.443 730.907 747.332L689 672L679.5 651.5L669.526 625.07C669.509 625.023 669.495 624.975 669.484 624.927L668.043 618.203C668.015 618.069 668.014 617.931 668.041 617.797L674.5 585.5L675.975 576.16C675.991 576.054 675.991 575.946 675.973 575.84L675.523 573.136C675.508 573.046 675.48 572.958 675.441 572.875L671.5 564.5L671.224 563.947C671.083 563.666 671.083 563.334 671.224 563.053L671.441 562.618C671.48 562.54 671.53 562.467 671.588 562.401L675.431 558.078C675.477 558.026 675.517 557.97 675.552 557.91L677.212 555.004C677.39 554.692 677.721 554.5 678.08 554.5H684.5",
      delay: 3.5,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.tajFalaknumaPlace_d_25_42,
      distance: "25 km",
      time: "42 min",
      landmark_name: "Taj Falaknuma Palace",
      details:
        "Taj Falaknuma Palace, Hyderabad, stands as one of the world's most expansive private residences and palatial estates, bearing a historical legacy of unparalleled significance.",
      img: "/landmarks/taj-falaknuma-palace.webp",
    }),
  },
  chilkurBalaji: {
    icon: <AnimatedLandmarkIcon landmarkKey="chilkurBalaji" delay={4.0}/>,
    route: createLandmark({
      id: "__route chilkur balaji",
      path: "M549.5 665L559.769 711.946C559.894 712.515 560.476 712.857 561.034 712.69L570 710C572.744 709.29 575.5 709 578 709.5L581.915 710.479C581.972 710.493 582.03 710.502 582.088 710.506C584.961 710.707 586.596 710.732 589.395 710.508C589.464 710.503 589.534 710.49 589.601 710.47C591.622 709.869 592.786 709.528 594.5 709C596.13 708.517 597.101 708.11 598.875 707.073C598.958 707.025 599.033 706.964 599.099 706.894L628 676C630.28 674.147 631.443 673.501 633.433 672.532C633.477 672.511 633.523 672.493 633.57 672.478C635.603 671.854 639 671.5 639 671.5C639 671.5 642.427 671.385 644.5 672C647.696 672.704 649.511 673.053 652.5 674.5L662.914 678.963C662.971 678.988 663.031 679.007 663.091 679.02L667.393 679.976C667.464 679.992 667.537 680 667.61 680H671.39C671.463 680 671.536 679.992 671.607 679.976L676 679L685.5 675.5L689.372 674.338C689.963 674.161 690.254 673.496 689.984 672.942L680.5 653.5L669.5 624.5L668.048 618.21C668.017 618.072 668.014 617.928 668.042 617.789L671.5 600.5L674 588.5L675.976 575.658C675.992 575.553 675.991 575.447 675.974 575.342L675.521 572.628C675.507 572.543 675.482 572.46 675.447 572.382L671.268 563.095C671.105 562.733 671.171 562.31 671.436 562.015L675.389 557.623C675.463 557.542 675.522 557.449 675.565 557.348L676.74 554.606C676.898 554.238 677.259 554 677.659 554H684.5",
      delay: 4.0,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.chilkurBalaji,
      distance: "15.7 km",
      time: "32 min",
      landmark_name: "Chilkur Balaji Temple",
      details:
        "Chilkur Balaji Temple, popularly known as Visa Balaji Temple, is an ancient Hindu temple of Lord Balaji on the banks of Osman Sagar in Rangareddy District.",
      img: "/landmarks/chilkur-temple.webp",
    }),
  },
  divyasreeOrionSez_d_6_14: {
    icon: <AnimatedLandmarkIcon landmarkKey="divyasreeOrionSez_d_6_14" delay={4.5}/>,
    route: createLandmark({
      id: "__landmark Divyasree Orion SEZ _d_6_14",
      path: "M735.5 500.5L743.345 494.04C743.723 493.728 744.27 493.737 744.639 494.059L747.255 496.348C747.668 496.709 747.713 497.335 747.356 497.752L745 500.5L740.101 504.909C740.034 504.97 739.959 505.02 739.879 505.061L733.125 508.437C733.042 508.479 732.954 508.509 732.862 508.526L725.091 509.983C725.031 509.994 724.969 510 724.907 510H711.5L686.878 508.552C686.376 508.522 685.93 508.87 685.837 509.364L677.659 552.66C677.567 553.144 677.841 553.622 678.305 553.787L684.5 556",
      delay: 4.5,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIconsHyd.divyasreeOrionSez_d_6_14,
      distance: "7.5 km",
      time: "17 min",
      landmark_name: "Divyasree Orion SEZ",
      details:
        "Divyasree Orion SEZ is a special economic zone located in Greater Noida, India. It is a hub for industrial and commercial activities, offering a conducive environment for businesses to thrive.",
      img: "/landmarks/divyasree-orion.webp",
    }),
  },
};

interface LandmarkItem {
  icon: React.ReactElement;
  id: string;
  route: React.ReactElement;
  routeDetails: {
    icon: React.ReactNode;
    distance: string;
    time: string;
    landmark_name: string;
    details: string;
    img: string;
  };
}

export const landmarks_hyd: LandmarkItem[] = Object.entries(
  LandmarkLandmark
).map(([_, { icon, route, routeDetails }]) => ({
  icon,
  id: route.props.id,
  route,
  routeDetails,
}));
