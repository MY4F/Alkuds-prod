const LoadingButton = ({ 
    loading, 
    defaultText, 
    loadingText, 
    className = "", 
    ...props 
  }) => {
    return (
      <button
        disabled={loading}
        type="submit"
        className={` max-w-[300px] min-w-[110px] whitespace-nowrap add-btn iron-btn text-[14px] md:text-[25px] ${className} ${
          loading ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400" : ""
        }`}
        {...props}
      >
        {loading ? loadingText : defaultText}
      </button>
    );
  };
  
export default LoadingButton;
  